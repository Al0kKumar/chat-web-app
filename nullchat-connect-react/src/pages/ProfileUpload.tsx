import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, ImageIcon } from 'lucide-react';
import API from '@/api';

const ProfileUpload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {

    if (!imageFile) {
        alert('No image selected');
        return;
    }

    if (!email || !imageFile) {
      alert('Missing data');
      return;
    }
    
    const token = localStorage.getItem('token');

    if(!token){
        alert('bloddy token is missing ');
        return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('profilePic', imageFile); 

      const res = await API.post('/upload-profile-pic', formData, {
        headers: { 
             Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' },
      });

      console.log('Profile uploaded:', res.data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Upload failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-green-400 mr-3" />
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Nullchat
            </h1>
          </div>
        </div>

        {/* Card */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-white text-2xl">
              Upload Profile Picture
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Add a face to your encrypted identity
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-zinc-300
              file:bg-gradient-to-r file:from-green-400 file:to-cyan-400
              file:text-black file:px-4 file:py-2 file:rounded-lg
              file:border-none file:cursor-pointer"
            />

            {/* Preview */}
            {previewUrl && (
              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full border border-white/20"
                />
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!imageFile || loading}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Uploading…' : 'Finish & Enter App'}
            </Button>

            {/* Skip */}
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="w-full text-zinc-500 hover:text-white hover:bg-white/10"
            >
              Skip for now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileUpload;
