import { supabase } from '../lib/supabase';

async function testStorage() {
  try {
    // Create a simple text file for testing
    const testData = new Blob(['Hello World'], { type: 'text/plain' });
    
    // Try to upload the file
    const { data, error } = await supabase.storage
      .from('parent-app-media')
      .upload('test.txt', testData);

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    console.log('File uploaded successfully:', data);

    // Try to get the file URL
    const { data: { publicUrl } } = supabase.storage
      .from('parent-app-media')
      .getPublicUrl('test.txt');

    console.log('File URL:', publicUrl);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testStorage();
