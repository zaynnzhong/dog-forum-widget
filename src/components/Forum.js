import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaPaw, FaComment, FaHeart, FaShare } from 'react-icons/fa';

const ForumContainer = styled.div`
  width: 100%;
`;

const TopicsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TopicCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.small};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    border-color: ${props => props.theme.colors.primary};
    background: linear-gradient(135deg, ${props => props.theme.colors.white} 0%, ${props => props.theme.colors.secondary} 100%);
  }
`;

const TopicTitle = styled.h3`
  color: ${props => props.theme.colors.black};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TopicDescription = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: 0.9rem;
`;

const DiscussionSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 12px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const UsernameInput = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray.dark};
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PostButton = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  
  &:hover {
    background: ${props => props.theme.colors.black};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray.light};
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.small};
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const PostTime = styled.span`
  color: ${props => props.theme.colors.gray.dark};
  font-size: 0.85rem;
`;

const PostContent = styled.p`
  color: ${props => props.theme.colors.black};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray.light};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: 20px;
  color: ${props => props.theme.colors.gray.dark};
  font-size: 0.9rem;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  
  &.liked {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CommentsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray.light};
`;

const CommentBox = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: 20px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CommentButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.theme.colors.black};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Comment = styled.div`
  padding: 0.75rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 12px;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-right: 0.5rem;
`;

const CommentText = styled.span`
  color: ${props => props.theme.colors.black};
`;

const topics = [
  { id: 'parks', title: 'Dog Parks', icon: '🏞️', description: 'Best local parks and play areas' },
  { id: 'recipes', title: 'Recipes', icon: '🍖', description: 'Homemade treats and meals' },
  { id: 'training', title: 'Training Tips', icon: '🎾', description: 'Training advice and techniques' },
  { id: 'health', title: 'Health & Care', icon: '💊', description: 'Health tips and vet advice' },
  { id: 'grooming', title: 'Grooming', icon: '✂️', description: 'Grooming tips and tools' },
  { id: 'general', title: 'General Chat', icon: '💬', description: 'Everything dog-related' }
];

function Forum() {
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentUsername, setCommentUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('dogForumUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setCommentUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          likedBy: doc.data().likedBy || [],
          comments: doc.data().comments || []
        }))
        .filter(post => post.topic === selectedTopic);
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, [selectedTopic]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !username.trim()) return;

    setLoading(true);
    try {
      localStorage.setItem('dogForumUsername', username);
      setCommentUsername(username);
      await addDoc(collection(db, 'posts'), {
        content: newPost,
        topic: selectedTopic,
        authorName: username,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: []
      });
      setNewPost('');
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, currentLikes, likedBy = []) => {
    const userId = localStorage.getItem('dogForumUserId') || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('dogForumUserId', userId);

    try {
      const postRef = doc(db, 'posts', postId);
      if (likedBy.includes(userId)) {
        await updateDoc(postRef, {
          likes: Math.max(0, currentLikes - 1),
          likedBy: arrayRemove(userId)
        });
      } else {
        await updateDoc(postRef, {
          likes: currentLikes + 1,
          likedBy: arrayUnion(userId)
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (postId) => {
    const comment = commentInputs[postId];
    const name = commentUsername || username;
    
    if (!comment?.trim() || !name?.trim()) return;

    try {
      localStorage.setItem('dogForumUsername', name);
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          text: comment,
          authorName: name,
          createdAt: new Date().toISOString()
        })
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = (post) => {
    const shareText = `Check out this post from DogLovers Forum: "${post.content}" by ${post.authorName}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'DogLovers Forum',
        text: shareText,
        url: shareUrl
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const userId = localStorage.getItem('dogForumUserId');

  return (
    <ForumContainer>
      <TopicsSection>
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            className={selectedTopic === topic.id ? 'active' : ''}
            onClick={() => setSelectedTopic(topic.id)}
          >
            <TopicTitle>
              <span>{topic.icon}</span>
              {topic.title}
            </TopicTitle>
            <TopicDescription>{topic.description}</TopicDescription>
          </TopicCard>
        ))}
      </TopicsSection>
      
      <DiscussionSection>
        <h2 style={{ marginBottom: '1.5rem', color: '#ff6620', fontSize: '1.3rem' }}>
          {topics.find(t => t.id === selectedTopic)?.icon} {topics.find(t => t.id === selectedTopic)?.title}
        </h2>
        
        <PostForm onSubmit={handleSubmitPost}>
          <InputRow>
            <UsernameInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              required
            />
            <TextArea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={`Share your thoughts about ${topics.find(t => t.id === selectedTopic)?.title.toLowerCase()}...`}
              required
              style={{ flex: 1 }}
            />
            <PostButton type="submit" disabled={loading || !newPost.trim() || !username.trim()}>
              Post
            </PostButton>
          </InputRow>
        </PostForm>
        
        <PostsList>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              No posts yet. Be the first to start a conversation!
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id}>
                <PostHeader>
                  <PostAuthor>
                    <FaPaw /> {post.authorName}
                  </PostAuthor>
                  <PostTime>{formatTime(post.createdAt)}</PostTime>
                </PostHeader>
                <PostContent>{post.content}</PostContent>
                <PostActions>
                  <ActionButton
                    className={post.likedBy?.includes(userId) ? 'liked' : ''}
                    onClick={() => handleLike(post.id, post.likes || 0, post.likedBy)}
                  >
                    <FaHeart /> {post.likes || 0}
                  </ActionButton>
                  <ActionButton onClick={() => toggleComments(post.id)}>
                    <FaComment /> {post.comments?.length || 0}
                  </ActionButton>
                  <ActionButton onClick={() => handleShare(post)}>
                    <FaShare /> Share
                  </ActionButton>
                </PostActions>
                
                {showComments[post.id] && (
                  <CommentsSection>
                    {post.comments?.map((comment, idx) => (
                      <Comment key={idx}>
                        <CommentAuthor>{comment.authorName}:</CommentAuthor>
                        <CommentText>{comment.text}</CommentText>
                      </Comment>
                    ))}
                    <CommentBox>
                      <CommentInput
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value
                        })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id);
                          }
                        }}
                      />
                      <CommentButton
                        onClick={() => handleComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim() || !commentUsername?.trim()}
                      >
                        Post
                      </CommentButton>
                    </CommentBox>
                    {!commentUsername && (
                      <UsernameInput
                        type="text"
                        value={commentUsername}
                        onChange={(e) => setCommentUsername(e.target.value)}
                        placeholder="Your name for comments"
                        style={{ marginTop: '0.5rem', width: '100%' }}
                      />
                    )}
                  </CommentsSection>
                )}
              </PostCard>
            ))
          )}
        </PostsList>
      </DiscussionSection>
    </ForumContainer>
  );
}

export default Forum;