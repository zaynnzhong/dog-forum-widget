import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { FaCamera, FaHeart, FaPaw, FaUpload, FaTimes } from 'react-icons/fa';

const PhotoBoothContainer = styled.div`
  width: 100%;
`;

const UploadSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const DropzoneArea = styled.div`
  border: 3px dashed ${props => props.$isDragActive ? props.theme.colors.primary : props.theme.colors.gray.medium};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isDragActive ? props.theme.colors.secondary : props.theme.colors.white};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.secondary};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.black};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: 0.9rem;
`;

const PreviewSection = styled.div`
  margin-top: 2rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const CaptionInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const UsernameInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray.dark};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    
    &:hover {
      background: ${props => props.theme.colors.black};
    }
  }
  
  &.secondary {
    background: ${props => props.theme.colors.gray.medium};
    color: ${props => props.theme.colors.black};
    
    &:hover {
      background: ${props => props.theme.colors.gray.dark};
      color: ${props => props.theme.colors.white};
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PhotoCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const PhotoInfo = styled.div`
  padding: 1rem;
`;

const PhotoCaption = styled.p`
  color: ${props => props.theme.colors.black};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const PhotoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid ${props => props.theme.colors.gray.light};
`;

const PhotoAuthor = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LikeButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.liked ? props.theme.colors.primary : props.theme.colors.gray.dark};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }
`;

function PhotoBooth() {
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [username, setUsername] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('dogForumUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'photos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likedBy: doc.data().likedBy || []
      }));
      setPhotos(photosData);
    });

    return () => unsubscribe();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview({
          url: e.target.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!preview || !username.trim()) {
      alert('Please enter your name before uploading');
      return;
    }

    setUploading(true);
    try {
      localStorage.setItem('dogForumUsername', username);
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 11);
      // Clean filename to avoid issues
      const cleanFileName = preview.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${randomId}_${timestamp}_${cleanFileName}`;
      const storageRef = ref(storage, `photos/${fileName}`);
      
      console.log('Uploading to:', `photos/${fileName}`);
      
      await uploadBytes(storageRef, preview.file);
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('Upload successful, URL:', downloadURL);
      
      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        caption: caption || 'My furry friend!',
        authorName: username,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: []
      });
      
      setPreview(null);
      setCaption('');
      setUsername(username); // Keep username for next upload
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(`Failed to upload photo: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setCaption('');
  };

  const userId = localStorage.getItem('dogForumUserId');

  const handleLike = async (photoId, currentLikes, likedBy = []) => {
    const userId = localStorage.getItem('dogForumUserId') || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('dogForumUserId', userId);

    try {
      const photoRef = doc(db, 'photos', photoId);
      if (likedBy.includes(userId)) {
        await updateDoc(photoRef, {
          likes: Math.max(0, currentLikes - 1),
          likedBy: arrayRemove(userId)
        });
      } else {
        await updateDoc(photoRef, {
          likes: currentLikes + 1,
          likedBy: arrayUnion(userId)
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <PhotoBoothContainer>
      
      <UploadSection>
        {!preview ? (
          <DropzoneArea {...getRootProps()} $isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <UploadIcon>
              <FaUpload />
            </UploadIcon>
            <UploadText>
              {isDragActive ? 'Drop your photo here!' : 'Click or drag to upload a photo'}
            </UploadText>
            <UploadHint>Supports JPG, PNG, GIF up to 10MB</UploadHint>
          </DropzoneArea>
        ) : (
          <PreviewSection show={true}>
            <PreviewImage src={preview.url} alt="Preview" />
            <UsernameInput
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <CaptionInput
              type="text"
              placeholder="Add a caption about your furry friend..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <ButtonGroup>
              <Button 
                className="primary" 
                onClick={handleUpload}
                disabled={uploading || !username.trim()}
              >
                <FaCamera /> {uploading ? 'Uploading...' : 'Share Photo'}
              </Button>
              <Button 
                className="secondary" 
                onClick={handleCancel}
                disabled={uploading}
              >
                <FaTimes /> Cancel
              </Button>
            </ButtonGroup>
          </PreviewSection>
        )}
      </UploadSection>
      
      <PhotoGrid>
        {photos.map(photo => (
          <PhotoCard key={photo.id}>
            <PhotoImage src={photo.url} alt={photo.caption} />
            <PhotoInfo>
              <PhotoCaption>{photo.caption}</PhotoCaption>
              <PhotoMeta>
                <PhotoAuthor>
                  <FaPaw /> {photo.authorName}
                </PhotoAuthor>
                <LikeButton 
                  liked={photo.likedBy?.includes(userId)}
                  onClick={() => handleLike(photo.id, photo.likes || 0, photo.likedBy)}
                >
                  <FaHeart />
                  <span>{photo.likes || 0}</span>
                </LikeButton>
              </PhotoMeta>
            </PhotoInfo>
          </PhotoCard>
        ))}
      </PhotoGrid>
      
      {photos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <FaCamera style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
          <p>No photos yet. Be the first to share!</p>
        </div>
      )}
    </PhotoBoothContainer>
  );
}

export default PhotoBooth;