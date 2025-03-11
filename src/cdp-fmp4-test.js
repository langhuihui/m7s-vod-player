/**
 * Test the Fmp4Parser using Chrome DevTools Protocol (CDP)
 */

const CDP = require('chrome-remote-interface');
const fs = require('fs');
const path = require('path');

async function testFmp4Parser() {
  let client;

  try {
    // Connect to an existing Chrome instance using CDP
    client = await CDP();
    const { Page, Runtime } = client;

    // Enable necessary domains
    await Page.enable();

    // Navigate to your application page
    await Page.navigate({ url: 'http://localhost:5173' });
    await Page.loadEventFired();

    console.log('Page loaded, testing Fmp4Parser...');

    // Sample fmp4 parsing test
    const result = await Runtime.evaluate({
      expression: `
        // We'll create a more complete mock fmp4 structure for testing
        // In a real scenario, you would load an actual fmp4 file
        function createMockFmp4() {
          // Create a more complete mock fmp4 structure with codec information
          const buffer = new ArrayBuffer(256);
          const view = new DataView(buffer);
          let offset = 0;
          
          // ftyp box (24 bytes)
          view.setUint32(offset, 24, false); // size
          view.setUint8(offset + 4, 102); // 'f'
          view.setUint8(offset + 5, 116); // 't'
          view.setUint8(offset + 6, 121); // 'y'
          view.setUint8(offset + 7, 112); // 'p'
          offset += 24;
          
          // moov box
          const moovStart = offset;
          view.setUint8(offset + 4, 109); // 'm'
          view.setUint8(offset + 5, 111); // 'o'
          view.setUint8(offset + 6, 111); // 'o'
          view.setUint8(offset + 7, 118); // 'v'
          offset += 8;
          
          // trak box
          const trakStart = offset;
          view.setUint8(offset + 4, 116); // 't'
          view.setUint8(offset + 5, 114); // 'r'
          view.setUint8(offset + 6, 97);  // 'a'
          view.setUint8(offset + 7, 107); // 'k'
          offset += 8;
          
          // mdia box
          const mdiaStart = offset;
          view.setUint8(offset + 4, 109); // 'm'
          view.setUint8(offset + 5, 100); // 'd'
          view.setUint8(offset + 6, 105); // 'i'
          view.setUint8(offset + 7, 97);  // 'a'
          offset += 8;
          
          // minf box
          const minfStart = offset;
          view.setUint8(offset + 4, 109); // 'm'
          view.setUint8(offset + 5, 105); // 'i'
          view.setUint8(offset + 6, 110); // 'n'
          view.setUint8(offset + 7, 102); // 'f'
          offset += 8;
          
          // stbl box
          const stblStart = offset;
          view.setUint8(offset + 4, 115); // 's'
          view.setUint8(offset + 5, 116); // 't'
          view.setUint8(offset + 6, 98);  // 'b'
          view.setUint8(offset + 7, 108); // 'l'
          offset += 8;
          
          // stsd box with avc1 and avcC
          const stsdStart = offset;
          view.setUint32(offset, 80, false); // stsd size
          view.setUint8(offset + 4, 115); // 's'
          view.setUint8(offset + 5, 116); // 't'
          view.setUint8(offset + 6, 115); // 's'
          view.setUint8(offset + 7, 100); // 'd'
          view.setUint32(offset + 8, 0, false); // version and flags
          view.setUint32(offset + 12, 1, false); // entry count
          offset += 16;
          
          // avc1 box
          const avc1Start = offset;
          view.setUint32(offset, 56, false); // avc1 size
          view.setUint8(offset + 4, 97);  // 'a'
          view.setUint8(offset + 5, 118);  // 'v'
          view.setUint8(offset + 6, 99);   // 'c'
          view.setUint8(offset + 7, 49);   // '1'
          offset += 78; // Skip reserved bytes
          
          // avcC box
          view.setUint32(offset, 16, false); // avcC size
          view.setUint8(offset + 4, 97);  // 'a'
          view.setUint8(offset + 5, 118);  // 'v'
          view.setUint8(offset + 6, 99);   // 'c'
          view.setUint8(offset + 7, 67);   // 'C'
          view.setUint8(offset + 8, 1);    // configurationVersion
          view.setUint8(offset + 9, 100);  // profile indication (High Profile = 100)
          view.setUint8(offset + 10, 0);   // profile compatibility
          view.setUint8(offset + 11, 31);  // level indication (Level 3.1 = 31)
          offset += 16;
          
          // Update box sizes
          view.setUint32(stsdStart, offset - stsdStart, false);
          view.setUint32(stblStart, offset - stblStart, false);
          view.setUint32(minfStart, offset - minfStart, false);
          view.setUint32(mdiaStart, offset - mdiaStart, false);
          view.setUint32(trakStart, offset - trakStart, false);
          view.setUint32(moovStart, offset - moovStart, false);
          
          return buffer;
        }

        // Import the parser - in actual use this would be an import statement
        const { Fmp4Parser } = await import('./Fmp4Parser.ts');
        
        // Create the mock fmp4 data
        const mockFmp4 = createMockFmp4();
        
        // Create a parser with debug mode enabled
        const parser = new Fmp4Parser(true);
        
        // Parse the mock fmp4
        const boxes = parser.parse(mockFmp4);
        
        // Get the formatted structure
        const structure = parser.printBoxes(boxes);
        
        // Get codec strings
        const codecs = parser.generateCodecStrings();
        
        // Get all box types using the map
        const boxTypes = Array.from(new Set(
          boxes.flatMap(box => {
            const types = [box.type];
            if (box.children) {
              types.push(...box.children.map(child => child.type));
            }
            return types;
          })
        )).sort();
        
        // Return the results
        return {
          structure,
          codecs,
          boxTypes,
          // Get some specific box types to demonstrate the map functionality
          avcCBoxes: parser.getBoxesByType('avcC').length,
          stsdBoxes: parser.getBoxesByType('stsd').length
        };
      `,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Fmp4Parser Test Result:');
    console.log('Box Structure:');
    console.log(result.result.value.structure);
    console.log('\nCodec Strings:');
    console.log(result.result.value.codecs);
    console.log('\nBox Types Found:', result.result.value.boxTypes);
    console.log('\nSpecific Box Counts:');
    console.log('avcC boxes:', result.result.value.avcCBoxes);
    console.log('stsd boxes:', result.result.value.stsdBoxes);

    return result.result.value;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the test
testFmp4Parser()
  .then(result => {
    console.log('Test completed successfully');
  })
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  }); 