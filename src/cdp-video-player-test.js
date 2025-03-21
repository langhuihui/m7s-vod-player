/**
 * CDP Video Player Test
 * 
 * This script demonstrates how to use the video-player web component with CDP
 * 
 * Instructions:
 * 1. Start Chrome with remote debugging enabled:
 *    chrome --remote-debugging-port=9222
 * 2. Navigate to http://localhost:8081/src/video-player-test.html
 * 3. Run this script with Node.js
 */

import CDP from 'chrome-remote-interface';

async function runTest() {
  console.log('Starting CDP video player test...');
  let client;

  try {
    console.log('Connecting to Chrome...');
    // Connect to an existing Chrome instance
    client = await CDP();
    const { Runtime, Page } = client;

    console.log('Connected to Chrome successfully');

    // Enable necessary domains
    console.log('Enabling CDP domains...');
    await Promise.all([
      Page.enable(),
      Runtime.enable()
    ]);

    // Listen for console messages
    Runtime.consoleAPICalled(({ type, args }) => {
      const text = args.map(arg => arg.value || arg.description).join(' ');
      console.log(`Browser console [${type}]:`, text);
    });

    // Listen for errors
    Runtime.exceptionThrown(({ exceptionDetails }) => {
      console.error('Browser error:', exceptionDetails.exception.description);
    });

    // Navigate to the test page
    console.log('Navigating to test page...');
    const response = await Page.navigate({ url: 'http://localhost:8000/src/video-player-test.html' });
    console.log('Navigation response:', response);

    // Wait for page load
    console.log('Waiting for page load...');
    await Page.loadEventFired();

    console.log('Test page loaded');

    // Check if the page loaded successfully
    const result = await Runtime.evaluate({
      expression: 'document.readyState'
    });
    console.log('Page ready state:', result.result.value);

    // Wait for the component to be ready
    console.log('Waiting for video-player component...');
    await Runtime.evaluate({
      expression: `
        await customElements.whenDefined('video-player');
      `,
      awaitPromise: true
    });

    console.log('Video Player component loaded');

    // Verify the component exists
    const componentCheck = await Runtime.evaluate({
      expression: 'document.querySelector("video-player") !== null',
      returnByValue: true
    });

    if (!componentCheck.result.value) {
      throw new Error('Video player component not found in the page');
    }

    // Get player element
    const { result: { objectId } } = await Runtime.evaluate({
      expression: 'document.querySelector("video-player")',
      returnByValue: false
    });

    // Test player methods
    await testPlayerMethods(Runtime, objectId);

    console.log('Video Player test completed successfully');

  } catch (err) {
    console.error('Test failed:', err);
    if (err.response) {
      console.error('CDP response error:', err.response);
    }
  } finally {
    if (client) {
      console.log('Closing CDP connection...');
      await client.close();
    }
  }
}

async function testPlayerMethods(Runtime, playerObjectId) {
  console.log('Testing player methods...');

  try {
    // Set video source
    console.log('Setting video source...');
    await Runtime.callFunctionOn({
      objectId: playerObjectId,
      functionDeclaration: `
        function() {
          console.log('Current player state:', {
            hasVideo: !!this.shadowRoot?.querySelector('video'),
            src: this.src,
            debug: this.debug
          });
          this.src = 'http://localhost:8080/hls/vod/fmp4.m3u8?start=1740655216&streamPath=live/test';
          this.debug = true;
          return 'Video source set';
        }
      `,
      returnByValue: true
    });

    // Wait for timeline to be set up
    console.log('Waiting for timeline setup...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test play/pause
    console.log('Testing play/pause...');
    await Runtime.callFunctionOn({
      objectId: playerObjectId,
      functionDeclaration: `
        async function() {
          // Toggle play
          const video = this.shadowRoot.querySelector('video');
          console.log('Video element state:', {
            paused: video?.paused,
            readyState: video?.readyState,
            error: video?.error
          });
          
          if (video.paused) {
            console.log('Playing video...');
            await this.togglePlay();
          }
          
          // Wait 3 seconds then pause
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          console.log('Pausing video...');
          await this.togglePlay();
          
          // Test seeking
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Seeking to 30 seconds...');
          this.seek(30);
          return 'Play/pause test completed';
        }
      `,
      awaitPromise: true,
      returnByValue: true
    });

    // Monitor events
    console.log('Setting up event monitoring...');
    await Runtime.evaluate({
      expression: `
        const player = document.querySelector('video-player');
        player.addEventListener('timeupdate', (e) => {
          console.log('Current position:', e.detail);
        });
        
        player.addEventListener('segments', (e) => {
          console.log('Segments loaded:', e.detail.length);
        });
      `
    });

    // Wait for events to be processed
    console.log('Waiting for events...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (err) {
    console.error('Error in testPlayerMethods:', err);
    throw err;
  }
}

// Run the test
runTest().catch(console.error); 