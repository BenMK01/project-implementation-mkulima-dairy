// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Ensure this path is correct

// Define the UserProfile interface based on your backend serializer
interface UserProfile {
  location: string;
  farm_size_acres: number | null;
  phone_number: string;
}

// Define the User interface
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log("Fetching user profile from: /api/auth/user/profile/"); // Debug log
        const response = await api.get<User>('/api/auth/user/profile/'); // Specify the expected type
        console.log("Profile fetched successfully:", response.data); // Debug log
        // Initialize profile if it's null (backend should ideally always provide one, but handle just in case)
        const userData = response.data;
        if (!userData.profile) {
          userData.profile = {
            location: '',
            farm_size_acres: null,
            phone_number: ''
          };
        }
        setUser(userData);
      } catch (err: any) {
        console.error("Error fetching user profile:", err); // Debug log
        console.error("Error response:", err.response); // Debug log
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Redirect to login if not authenticated or forbidden
          console.log("Redirecting to login due to auth error.");
          navigate('/login');
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;

    // Use functional state update to ensure we have the latest state
    setUser(prevUser => {
      if (!prevUser) return null; // Defensive check

      if (name.startsWith('profile.')) {
        const profileField = name.split('.')[1] as keyof UserProfile;
        return {
          ...prevUser,
          profile: { ...prevUser.profile, [profileField]: value }
        };
      } else {
        return { ...prevUser, [name]: value };
      }
    });
  };

  // Handle form submission (update profile)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      console.log("Updating profile to: ", user); // Debug log
      const response = await api.put<User>('/api/auth/user/profile/', user); // Specify the expected type
      console.log("Profile updated successfully:", response.data); // Debug log
      setUser(response.data); // Update local state with the response
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err); // Debug log
      console.error("Error response:", err.response); // Debug log
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  if (!user) {
    // This case should ideally not happen if loading/error states are handled correctly
    return <div className="container mx-auto px-4 py-8">No user profile data found.</div>;
  }

  // Initialize profile variable for easier access (handles potential null case from backend)
  const profile = user.profile || {
    location: '',
    farm_size_acres: null,
    phone_number: ''
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your account settings and profile information</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                {/* Username (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={user.username} disabled />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="profile.location">Location</Label>
                  <Input
                    id="profile.location"
                    name="profile.location"
                    value={profile.location}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Farm Size */}
                <div className="space-y-2">
                  <Label htmlFor="profile.farm_size_acres">Farm Size (Acres)</Label>
                  <Input
                    id="profile.farm_size_acres"
                    name="profile.farm_size_acres"
                    type="number"
                    step="0.1"
                    value={profile.farm_size_acres ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="profile.phone_number">Phone Number</Label>
                  <Input
                    id="profile.phone_number"
                    name="profile.phone_number"
                    value={profile.phone_number}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="w-full">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full">Cancel</Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Username</Label>
                <p className="text-foreground">{user.username}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-foreground">{user.email}</p>
              </div>
              <div>
                <Label>First Name</Label>
                <p className="text-foreground">{user.first_name || 'Not set'}</p>
              </div>
              <div>
                <Label>Last Name</Label>
                <p className="text-foreground">{user.last_name || 'Not set'}</p>
              </div>
              <div>
                <Label>Location</Label>
                <p className="text-foreground">{profile.location || 'Not set'}</p>
              </div>
              <div>
                <Label>Farm Size (Acres)</Label>
                <p className="text-foreground">{profile.farm_size_acres !== null ? profile.farm_size_acres : 'Not set'}</p>
              </div>
              <div>
                <Label>Phone Number</Label>
                <p className="text-foreground">{profile.phone_number || 'Not set'}</p>
              </div>
              <Button onClick={() => setIsEditing(true)} className="w-full">Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;