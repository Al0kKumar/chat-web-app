// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Edit, Loader2, Trash2, Upload } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';
// import axios from 'axios';

// const UserInfoPage = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { state } = useLocation();
//   const { username: stateUsername, phoneNumber: statePhone, id: displayedUserIdFromState } = state || {};

//   const [authenticatedUserId, setAuthenticatedUserId] = useState<number | null>(null);
//   const [isLoadingAuthId, setIsLoadingAuthId] = useState(true);
//   const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
//   const [loadingUpload, setLoadingUpload] = useState(false);
//   const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(null);

//   const [username, setUsername] = useState(stateUsername || '');
//   const [phoneNumber, setPhoneNumber] = useState(statePhone || '');
//   const [displayedUserId, setDisplayedUserId] = useState<number | null>(displayedUserIdFromState || null);

//   const fetchUserData = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     try {
//       const authRes = await axios.get('https://chat-web-app-6330.onrender.com/api/v1/userDetails', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const authId = authRes.data.id;
//       setAuthenticatedUserId(authId);
//       setIsLoadingAuthId(false);

//       if (!displayedUserIdFromState || authId === displayedUserIdFromState) {
//         setDisplayedUserId(authId);
//         setUsername(authRes.data.name);
//         setPhoneNumber(authRes.data.phoneNumber);
//         setCurrentProfilePic(`${authRes.data.profilePic}?t=${Date.now()}`);
//       } else {
//         const otherRes = await axios.get(
//           `https://chat-web-app-6330.onrender.com/api/v1/recipentdetails/${displayedUserIdFromState}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const other = otherRes.data;
//         setDisplayedUserId(other.id);
//         setUsername(other.name);
//         setPhoneNumber(other.phoneNumber);
//         setCurrentProfilePic(`${other.profilePic}?t=${Date.now()}`);
//       }
//     } catch (err) {
//       console.error('❌ Fetch failed:', err);
//       localStorage.clear();
//       navigate('/login');
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, [navigate, displayedUserIdFromState]);

//   const isMyProfile = !isLoadingAuthId && authenticatedUserId === displayedUserId;

//   const getInitials = () => {
//     return username
//       ? username
//           .split(' ')
//           .map((n) => n[0])
//           .join('')
//           .slice(0, 2)
//           .toUpperCase()
//       : phoneNumber?.slice(-2) || 'NA';
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setNewProfilePic(file);
//     const formData = new FormData();
//     formData.append('profilePic', file);

//     const token = localStorage.getItem('token');
//     try {
//       setLoadingUpload(true);
//       await axios.post('https://chat-web-app-6330.onrender.com/api/v1/upload-profile-pic', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       await fetchUserData(); // 🔥 Refresh data after upload
//       setNewProfilePic(null);

//       toast({
//         title: '✅ Profile Picture Updated',
//         description: 'Your new profile picture is live.',
//       });
//     } catch (err) {
//       console.error('Upload failed:', err);
//       toast({
//         variant: 'destructive',
//         title: 'Upload Failed',
//         description: 'Could not upload profile picture.',
//       });
//     } finally {
//       setLoadingUpload(false);
//     }
//   };

//   const handleRemoveProfilePic = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`https://chat-web-app-6330.onrender.com/api/v1/remove-profile-pic`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       await fetchUserData(); // 🔥 Refresh again after removal
//       toast({
//         title: '✅ Profile Picture Removed',
//         description: 'You no longer have a profile picture.',
//       });
//     } catch (err) {
//       console.error('Removal failed:', err);
//       toast({
//         variant: 'destructive',
//         title: 'Failed to Remove',
//         description: 'Could not remove profile picture.',
//       });
//     }
//   };

//   if (isLoadingAuthId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//         <span className="ml-3">Loading profile...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white px-6 py-8">
//       <div className="flex items-center mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 rounded-full hover:bg-white/10 transition"
//         >
//           <ArrowLeft className="text-white h-6 w-6" />
//         </button>
//         <h1 className="text-2xl font-bold ml-4">User Info</h1>
//       </div>

//       <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-md text-center">
//         <div className="w-24 h-24 mx-auto mb-2 relative">
//           <Avatar key={currentProfilePic} className="w-full h-full">
//             {currentProfilePic ? (
//               <AvatarImage
//                 src={currentProfilePic}
//                 alt={`${username || 'User'}'s profile`}
//                 className="object-cover"
//               />
//             ) : (
//               <AvatarFallback className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-3xl font-bold">
//                 {getInitials()}
//               </AvatarFallback>
//             )}
//           </Avatar>
//         </div>

//         {isMyProfile && (
//           <div className="flex justify-center gap-3 mt-3">
//             <label className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center shadow-md cursor-pointer">
//               {loadingUpload ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : currentProfilePic ? (
//                 <Edit className="h-5 w-5" />
//               ) : (
//                 <Upload className="h-5 w-5" />
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//             {currentProfilePic && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 h-10 w-10"
//                 onClick={handleRemoveProfilePic}
//                 disabled={loadingUpload}
//               >
//                 <Trash2 className="h-5 w-5" />
//               </Button>
//             )}
//           </div>
//         )}

//         <h2 className="mt-4 text-2xl font-semibold">
//           {username?.trim() ? username : 'Unknown User'}
//         </h2>

//         {phoneNumber ? (
//           <p className="mt-2 text-lg text-purple-200 flex items-center justify-center space-x-2">
//             <span className="bg-white/10 text-purple-300 px-2 py-0.5 rounded-full text-sm font-medium tracking-wide">+91</span>
//             <span className="text-white tracking-wide font-mono">{phoneNumber}</span>
//           </p>
//         ) : (
//           <p className="text-purple-300 mt-2">No Number</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserInfoPage;




import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2, Trash2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const UserInfoPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useLocation();
  const { username: stateUsername, phoneNumber: statePhone, id: displayedUserIdFromState } = state || {};

  const [authenticatedUserId, setAuthenticatedUserId] = useState<number | null>(null);
  const [isLoadingAuthId, setIsLoadingAuthId] = useState(true);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(null);

  const [username, setUsername] = useState(stateUsername || '');
  const [phoneNumber, setPhoneNumber] = useState(statePhone || '');
  const [displayedUserId, setDisplayedUserId] = useState<number | null>(displayedUserIdFromState || null);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const authRes = await axios.get('https://chat-web-app-6330.onrender.com/api/v1/userDetails', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const authId = authRes.data.id;
      setAuthenticatedUserId(authId);
      setIsLoadingAuthId(false);

      if (!displayedUserIdFromState || authId === displayedUserIdFromState) {
        setDisplayedUserId(authId);
        setUsername(authRes.data.name);
        setPhoneNumber(authRes.data.phoneNumber);
        setCurrentProfilePic(
          authRes.data.profilePic ? `${authRes.data.profilePic}?t=${Date.now()}` : null
        );
      } else {
        const otherRes = await axios.get(
          `https://chat-web-app-6330.onrender.com/api/v1/recipentdetails/${displayedUserIdFromState}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const other = otherRes.data;
        setDisplayedUserId(other.id);
        setUsername(other.name);
        setPhoneNumber(other.phoneNumber);
        setCurrentProfilePic(
          other.profilePic ? `${other.profilePic}?t=${Date.now()}` : null
        );
      }
    } catch (err) {
      console.error('❌ Fetch failed:', err);
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate, displayedUserIdFromState]);

  const isMyProfile = !isLoadingAuthId && authenticatedUserId === displayedUserId;

  const getInitials = () => {
    return username
      ? username
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : phoneNumber?.slice(-2) || 'NA';
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewProfilePic(file);
    const formData = new FormData();
    formData.append('profilePic', file);

    const token = localStorage.getItem('token');
    try {
      setLoadingUpload(true);
      await axios.post('https://chat-web-app-6330.onrender.com/api/v1/upload-profile-pic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchUserData(); // 🔥 Refresh data after upload
      setNewProfilePic(null);

      toast({
        title: '✅ Profile Picture Updated',
        description: 'Your new profile picture is live.',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not upload profile picture.',
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://chat-web-app-6330.onrender.com/api/v1/remove-profile-pic`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUserData(); // 🔥 Refresh again after removal
      toast({
        title: '✅ Profile Picture Removed',
        description: 'You no longer have a profile picture.',
      });
    } catch (err) {
      console.error('Removal failed:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to Remove',
        description: 'Could not remove profile picture.',
      });
    }
  };

  if (isLoadingAuthId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-3">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white px-6 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft className="text-white h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold ml-4">User Info</h1>
      </div>

      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-md text-center">
        <div className="w-24 h-24 mx-auto mb-2 relative">
          <Avatar key={currentProfilePic} className="w-full h-full">
            {currentProfilePic ? (
              <AvatarImage
                src={currentProfilePic}
                onError={() => setCurrentProfilePic(null)}
                alt={`${username || 'User'}'s profile`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-3xl font-bold">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {isMyProfile && (
          <div className="flex justify-center gap-3 mt-3">
            <label className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center shadow-md cursor-pointer">
              {loadingUpload ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : currentProfilePic ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {currentProfilePic && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 h-10 w-10"
                onClick={handleRemoveProfilePic}
                disabled={loadingUpload}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        <h2 className="mt-4 text-2xl font-semibold">
          {username?.trim() ? username : 'Unknown User'}
        </h2>

        {phoneNumber ? (
          <p className="mt-2 text-lg text-purple-200 flex items-center justify-center space-x-2">
            <span className="bg-white/10 text-purple-300 px-2 py-0.5 rounded-full text-sm font-medium tracking-wide">+91</span>
            <span className="text-white tracking-wide font-mono">{phoneNumber}</span>
          </p>
        ) : (
          <p className="text-purple-300 mt-2">No Number</p>
        )}
      </div>
    </div>
  );
};

export default UserInfoPage;
