import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const UploadEngineeringDiagram = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const response = await fetch('http://localhost:3000/api/upload-diagram', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Engineering diagram uploaded successfully',
        });
        navigate('/bill-of-materials');
      } else {
        throw new Error(result.error || 'Failed to upload file');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload engineering diagram',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <PageLayout
      title="Cost Estimation - Upload Engineering Diagram"
      previousPage="/project-details"
      showNavigation={false}
    >
      <Navigation />
      
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upload Engineering Diagram</h2>
          <p className="text-gray-600">
            Please upload your engineering diagram to proceed with the cost estimation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagram">Engineering Diagram</Label>
            <input
              id="diagram"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-100 file:text-gray-700
                hover:file:bg-gray-200
                cursor-pointer"
            />
          </div>

          <div className="pt-4 flex justify-center">
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full mb-4">
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            <Button
              type="submit"
              disabled={!file || uploading}
              className="w-48"
            >
              {uploading ? 'Uploading...' : 'Upload & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default UploadEngineeringDiagram;