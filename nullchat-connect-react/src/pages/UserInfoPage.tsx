// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Edit, Loader2 } from 'lucide-react'; // Import Edit and Loader2 icons
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Fixed import path
// import { Button } from '@/components/ui/button'; // Fixed import path
// import axios from 'axios'; // For fetching authenticated user ID

// const UserInfoPage = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   // Destructure all relevant state variables, including id and profilePic
//   // 'id' from state is the ID of the user whose profile is being displayed
//   const { username, phoneNumber, id: displayedUserId, profilePic } = state || {};

//   const [authenticatedUserId, setAuthenticatedUserId] = useState<number | null>(null);
//   const [isLoadingAuthId, setIsLoadingAuthId] = useState(true);

//   // Fetch the authenticated user's ID from the backend
//   useEffect(() => {
//     const fetchAuthUserId = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         // If no token, user is not logged in, redirect to login
//         navigate('/login');
//         setIsLoadingAuthId(false);
//         return;
//       }

//       try {
//         // This endpoint should return at least the user's 'id'
//         // Make sure your backend's /api/v1/users/me endpoint is implemented
//         // to return the authenticated user's ID.
//         const response = await axios.get<{ id: number; }>(
//           'https://chat-web-app-6330.onrender.com/api/v1/userDetails',
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setAuthenticatedUserId(response.data.id);
//       } catch (error) {
//         console.error('❌ Error fetching authenticated user ID:', error);
//         // Handle token expiry or other authentication errors
//         if (axios.isAxiosError(error) && error.response?.status === 401) {
//           localStorage.clear();
//           navigate('/login');
//         }
//       } finally {
//         setIsLoadingAuthId(false);
//       }
//     };

//     fetchAuthUserId();
//   }, [navigate]); // Dependency array includes navigate

//   // Determine if the currently displayed profile belongs to the authenticated user
//   const isMyProfile = !isLoadingAuthId && authenticatedUserId === displayedUserId;

//   const getInitials = () => {
//     if (username) {
//       return username
//         .split(' ')
//         .map((n) => n[0])
//         .join('')
//         .slice(0, 2)
//         .toUpperCase();
//     }
//     // Fallback if no username, use last two digits of phone number or 'NA'
//     return phoneNumber?.slice(-2) || 'NA';
//   };

//   const handleEditProfilePic = () => {
//     // This is where you would trigger the profile picture upload process.
//     // For example, you could open a modal with an input type="file"
//     // or navigate to a dedicated profile editing page.
//     console.log('Edit profile picture clicked for user ID:', displayedUserId);
//     // Example: navigate to an upload page, passing the user ID
//     // navigate(`/user/upload-profile-pic/${displayedUserId}`);
//   };

//   // Show a loading state while the authenticated user's ID is being fetched
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
//       {/* Header */}
//       <div className="flex items-center mb-8">
//         <button
//           onClick={() => navigate(-1)} // Navigate back to the previous page
//           className="p-2 rounded-full hover:bg-white/10 transition"
//         >
//           <ArrowLeft className="text-white h-6 w-6" />
//         </button>
//         <h1 className="text-2xl font-bold ml-4">User Info</h1>
//       </div>

//       {/* User Card */}
//       <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-md text-center">
//         <div className="relative w-24 h-24 mx-auto mb-4"> {/* Container for avatar and edit button */}
//           <Avatar className="w-full h-full"> {/* Avatar takes full size of its container */}
//             {profilePic ? (
//               // If profilePic URL is available, display the image
//               <AvatarImage src={profilePic} alt={`${username || 'User'}'s profile`} className="object-cover" />
//             ) : (
//               // Otherwise, display the fallback avatar with initials
//               <AvatarFallback className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-3xl font-bold">
//                 {getInitials()}
//               </AvatarFallback>
//             )}
//           </Avatar>
//           {isMyProfile && ( // Conditionally render the edit button
//             <Button
//               variant="ghost" // Use a ghost variant for a subtle look
//               size="icon"
//               className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1 h-8 w-8 flex items-center justify-center shadow-md"
//               onClick={handleEditProfilePic} // Attach the edit handler
//             >
//               <Edit className="h-4 w-4" /> {/* Edit icon */}
//             </Button>
//           )}
//         </div>
//         <h2 className="mt-4 text-2xl font-semibold">{username || 'Unknown User'}</h2>
//         {phoneNumber ? (
//           <p className="mt-2 text-lg text-purple-200 flex items-center justify-center space-x-2">
//             <span className="bg-white/10 text-purple-300 px-2 py-0.5 rounded-full text-sm font-medium tracking-wide">
//               +91
//             </span>
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
import axios from 'axios';

const UserInfoPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name: stateName, phoneNumber: statePhone, id: displayedUserIdFromState, profilePic: stateProfilePic } = state || {};

  const [authenticatedUserId, setAuthenticatedUserId] = useState<number | null>(null);
  const [isLoadingAuthId, setIsLoadingAuthId] = useState(true);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(stateProfilePic || null);

  const [username, setUsername] = useState(stateName || '');
  const [phoneNumber, setPhoneNumber] = useState(statePhone || '');
  const [displayedUserId, setDisplayedUserId] = useState<number | null>(displayedUserIdFromState || null);

  // STEP 1: Fetch Authenticated User ID
  useEffect(() => {
    const fetchAuthUserId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://chat-web-app-6330.onrender.com/api/v1/userDetails', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const authId = response.data.id;
        setAuthenticatedUserId(authId);
        setIsLoadingAuthId(false);

        // CASE: own profile
        if (!displayedUserIdFromState || authId === displayedUserIdFromState) {
          setDisplayedUserId(authId);
          setUsername(response.data.name);
          setPhoneNumber(response.data.phoneNumber);
          setCurrentProfilePic(response.data.profilePic);
        } else {
          // CASE: viewing someone else's profile
          setDisplayedUserId(displayedUserIdFromState);
          setUsername(stateName || '');
          setPhoneNumber(statePhone || '');
          setCurrentProfilePic(stateProfilePic || null);
        }
      } catch (err) {
        console.error('❌ Auth fetch failed:', err);
        localStorage.clear();
        navigate('/login');
      }
    };

    fetchAuthUserId();
  }, [navigate, displayedUserIdFromState, stateName, statePhone, stateProfilePic]);

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
      const res = await axios.post('https://chat-web-app-6330.onrender.com/api/v1/upload-profile-pic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setCurrentProfilePic(res.data.updatedUrl);
      setNewProfilePic(null);
      alert('✅ Profile picture updated!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to update profile picture.');
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://chat-web-app-6330.onrender.com/api/v1/remove-profile-picture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentProfilePic(null);
      alert('✅ Profile picture removed.');
    } catch (err) {
      console.error('Removal failed:', err);
      alert('Failed to remove profile picture.');
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
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Avatar className="w-full h-full">
            {currentProfilePic ? (
              <AvatarImage src={currentProfilePic} alt={`${username || 'User'}'s profile`} className="object-cover" />
            ) : (
              <AvatarFallback className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-3xl font-bold">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>

          {isMyProfile && (
            <>
              {!currentProfilePic ? (
                <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1 h-8 w-8 flex items-center justify-center shadow-md cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <label className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1 h-8 w-8 flex items-center justify-center shadow-md cursor-pointer">
                    <Edit className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 h-8 w-8"
                    onClick={handleRemoveProfilePic}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

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
