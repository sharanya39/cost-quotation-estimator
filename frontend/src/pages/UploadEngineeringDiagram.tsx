import { useState, useRef } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: 'Error',
        description: 'Please select a PDF file',
        variant: 'destructive',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const response = await fetch('/api/upload-diagram', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch (error) {
        throw new Error('Invalid JSON response from server');
      }

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
            <Label htmlFor="diagram">Engineering Diagram (PDF only)</Label>
            <input
              id="diagram"
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
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

          {previewUrl && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-[600px]"
                title="PDF Preview"
              />
            </div>
          )}

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