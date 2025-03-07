import CDP from 'chrome-remote-interface';

// A utility function to wait for a specific time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function test() {
  let client;
  try {
    // Connect to an instance of Chrome
    client = await CDP();
    const { Page, Runtime, DOM } = client;

    // Enable necessary domains
    await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

    // Navigate to the app
    await Page.navigate({ url: 'http://localhost:5173/' });

    // Wait for page to load
    await Page.loadEventFired();
    await sleep(2000); // Extra time for app to initialize

    console.log('Page loaded');

    // Wait for HLS to load
    await sleep(5000); // Increased wait time for timeline to initialize

    // Execute tests
    const testVideoPlayerExists = await Runtime.evaluate({
      expression: `document.querySelector('video') !== null`
    });
    console.log('Video player exists:', testVideoPlayerExists.result.value);

    // Test if timeline elements exists once the timeline is loaded
    const timelineExists = await Runtime.evaluate({
      expression: `!!document.querySelector('.timeline')`
    });
    console.log('Timeline exists:', timelineExists.result.value);

    // Test if control buttons exist
    const controlButtonsExist = await Runtime.evaluate({
      expression: `document.querySelectorAll('.control-button').length === 3` // Play/pause, rewind, fast forward
    });
    console.log('Control buttons exist:', controlButtonsExist.result.value);

    // Test play/pause button
    if (controlButtonsExist.result.value) {
      await Runtime.evaluate({
        expression: `document.querySelector('.control-button').click()`
      });
      await sleep(1000);

      const isPlaying = await Runtime.evaluate({
        expression: `!document.querySelector('video').paused`
      });
      console.log('Video is playing after play button click:', isPlaying.result.value);

      // Test pause
      await Runtime.evaluate({
        expression: `document.querySelector('.control-button').click()`
      });
      await sleep(1000);

      const isPaused = await Runtime.evaluate({
        expression: `document.querySelector('video').paused`
      });
      console.log('Video is paused after pause button click:', isPaused.result.value);
    }

    // Test fast forward button
    if (controlButtonsExist.result.value) {
      // Get current time before fast forward
      const timeBeforeFastForward = await Runtime.evaluate({
        expression: `document.querySelector('video').currentTime`
      });

      // Click fast forward button (3rd button - index 2)
      await Runtime.evaluate({
        expression: `document.querySelectorAll('.control-button')[2].click()`
      });

      await sleep(1000);

      // Get time after fast forward
      const timeAfterFastForward = await Runtime.evaluate({
        expression: `document.querySelector('video').currentTime`
      });

      console.log('Time before fast forward:', timeBeforeFastForward.result.value);
      console.log('Time after fast forward:', timeAfterFastForward.result.value);
      console.log('Fast forward successful:', timeAfterFastForward.result.value > timeBeforeFastForward.result.value);
    }

    // Test rewind button
    if (controlButtonsExist.result.value) {
      // Get current time before rewind
      const timeBeforeRewind = await Runtime.evaluate({
        expression: `document.querySelector('video').currentTime`
      });

      // Click rewind button (2nd button - index 1)
      await Runtime.evaluate({
        expression: `document.querySelectorAll('.control-button')[1].click()`
      });

      await sleep(1000);

      // Get time after rewind
      const timeAfterRewind = await Runtime.evaluate({
        expression: `document.querySelector('video').currentTime`
      });

      console.log('Time before rewind:', timeBeforeRewind.result.value);
      console.log('Time after rewind:', timeAfterRewind.result.value);
      console.log('Rewind successful:', timeAfterRewind.result.value < timeBeforeRewind.result.value);
    }

    // Test playback rate buttons
    const playbackRateButtonsExist = await Runtime.evaluate({
      expression: `document.querySelectorAll('.playback-rate button').length > 0`
    });
    console.log('Playback rate buttons exist:', playbackRateButtonsExist.result.value);

    // Test clicking on timeline (if it exists)
    if (timelineExists.result.value) {
      // Get timeline dimensions for clicking
      const timelineDimensions = await Runtime.evaluate({
        expression: `(function() {
          const timeline = document.querySelector('.timeline');
          if (!timeline) return null;
          const rect = timeline.getBoundingClientRect();
          return { left: rect.left, width: rect.width, top: rect.top + (rect.height / 2) };
        })()`
      });

      if (timelineDimensions.result.value) {
        // Click in the middle of the timeline
        const clickX = timelineDimensions.result.value.left + (timelineDimensions.result.value.width / 2);
        const clickY = timelineDimensions.result.value.top;

        await Page.dispatchMouseEvent({
          type: 'mousePressed',
          x: clickX,
          y: clickY,
          button: 'left',
          clickCount: 1
        });

        await Page.dispatchMouseEvent({
          type: 'mouseReleased',
          x: clickX,
          y: clickY,
          button: 'left',
          clickCount: 1
        });

        console.log('Clicked on timeline at position:', clickX, clickY);

        // Verify that the seek was performed
        await sleep(1000);
        const currentTimeAfterSeek = await Runtime.evaluate({
          expression: `document.querySelector('video').currentTime`
        });
        console.log('Current time after seek:', currentTimeAfterSeek.result.value);
      }
    }

    console.log('All tests completed successfully');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the test
test(); 