import { supabase } from '../lib/supabase';

async function setupStorage() {
  try {
    // Create the storage bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('parent-app-media', {
      public: false,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/*', 'video/*']
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Bucket already exists, skipping creation.');
      } else {
        throw bucketError;
      }
    } else {
      console.log('Storage bucket created successfully!');
    }

    // Create storage policies for authenticated users
    const { data: policy, error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'parent-app-media',
      policy_name: 'authenticated_access',
      definition: `(auth.role() = 'authenticated' AND bucket_id = 'parent-app-media')`
    });

    if (policyError) {
      console.error('Error creating storage policy:', policyError.message);
    } else {
      console.log('Storage policies created successfully!');
    }

    console.log('Storage setup completed!');
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

setupStorage();
