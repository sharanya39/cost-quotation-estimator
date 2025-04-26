import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const UploadEngineeringDiagram = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file);
      // Navigate to Bill of Materials page after upload
      navigate('/bill-of-materials');
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
            <Button
              type="submit"
              disabled={!file}
              className="w-48"
            >
              Upload & Continue
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default UploadEngineeringDiagram;