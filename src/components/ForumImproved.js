import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaPaw, FaComment, FaHeart, FaShare, FaSearch, FaChevronDown, FaChevronUp, FaFilter, FaBook } from 'react-icons/fa';

const ForumContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const DesktopLayout = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 0 0 300px;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const MainColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const RightColumn = styled.div`
  flex: 0 0 300px;
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const StickySection = styled.div`
  position: sticky;
  top: 20px;
`;

const SearchSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.95rem;
  
  &::placeholder {
    color: ${props => props.theme.colors.gray.dark};
  }
`;

const SearchIcon = styled(FaSearch)`
  color: ${props => props.theme.colors.gray.dark};
`;

const PostFormCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray.dark};
    font-weight: normal;
  }
`;

const UsernameInput = styled.input`
  width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TopicSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TopicChip = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.black};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.gray.medium};
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PostButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  align-self: flex-end;
  
  &:hover {
    background: ${props => props.theme.colors.black};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TopicFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TopicFilterItem = styled.button`
  padding: 0.75rem 1rem;
  background: ${props => props.$active ? props.theme.colors.secondary : 'transparent'};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border-radius: 8px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const TopicName = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostCount = styled.span`
  background: ${props => props.theme.colors.gray.light};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.gray.dark};
`;

const SortSection = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.black};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
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
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const PostTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.black};
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray.dark};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PostTag = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.primary};
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const PostContent = styled.div`
  color: ${props => props.theme.colors.black};
  line-height: 1.6;
  margin-bottom: 1rem;
  
  &.collapsed {
    max-height: 100px;
    overflow: hidden;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: linear-gradient(transparent, ${props => props.theme.colors.white});
    }
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
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
  transition: all 0.3s ease;
  
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

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Comment = styled.div`
  padding: 0.75rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
`;

const CommentTime = styled.span`
  color: ${props => props.theme.colors.gray.dark};
  font-size: 0.8rem;
`;

const CommentText = styled.p`
  color: ${props => props.theme.colors.black};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  
  &.collapsed {
    max-height: 60px;
    overflow: hidden;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(transparent, ${props => props.theme.colors.secondary});
    }
  }
`;

const ShowMoreComments = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CommentBox = styled.div`
  display: flex;
  gap: 0.5rem;
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

const GuidelinesCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const GuidelinesTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const GuidelinesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GuidelineItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray.light};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.black};
  line-height: 1.5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '🐾';
    margin-right: 0.5rem;
  }
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.gray.dark};
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.small};
`;

const topics = [
  { id: 'general', title: 'General Chat', icon: '💬' },
  { id: 'parks', title: 'Dog Parks', icon: '🏞️' },
  { id: 'recipes', title: 'Recipes', icon: '🍖' },
  { id: 'training', title: 'Training', icon: '🎾' },
  { id: 'health', title: 'Health', icon: '💊' },
  { id: 'grooming', title: 'Grooming', icon: '✂️' }
];

const sortOptions = [
  { id: 'latest', label: 'Latest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'likes', label: 'Most Liked' }
];

function ForumImproved() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [username, setUsername] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [loading, setLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentUsername, setCommentUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [showAllComments, setShowAllComments] = useState({});

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
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likedBy: doc.data().likedBy || [],
        comments: doc.data().comments || []
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  // Calculate post counts per topic
  const topicCounts = useMemo(() => {
    const counts = {};
    topics.forEach(topic => {
      counts[topic.id] = posts.filter(p => p.topic === topic.id).length;
    });
    counts.all = posts.length;
    return counts;
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply topic filter
    if (filterTopic !== 'all') {
      filtered = filtered.filter(post => post.topic === filterTopic);
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'oldest':
        sorted.reverse();
        break;
      case 'popular':
        sorted.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      case 'likes':
        sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default: // latest
        break;
    }

    return sorted;
  }, [posts, searchQuery, filterTopic, sortBy]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !newPost.trim() || !username.trim()) return;

    setLoading(true);
    try {
      localStorage.setItem('dogForumUsername', username);
      setCommentUsername(username);
      await addDoc(collection(db, 'posts'), {
        title: postTitle,
        content: newPost,
        topic: selectedTopic,
        authorName: username,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: []
      });
      setPostTitle('');
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

  const handleShare = async (post) => {
    const shareText = `${post.title} - DogLovers Forum`;
    const shareUrl = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
      // Fallback to just copying text
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Link copied to clipboard!');
      } catch (clipErr) {
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Full date format
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  const getTopicInfo = (topicId) => {
    return topics.find(t => t.id === topicId) || topics.find(t => t.id === 'general');
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleCommentExpansion = (postId, commentIdx) => {
    const key = `${postId}-${commentIdx}`;
    setExpandedComments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleShowAllComments = (postId) => {
    setShowAllComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const userId = localStorage.getItem('dogForumUserId');

  return (
    <ForumContainer>
      <DesktopLayout>
        <LeftColumn>
          <StickySection>
            <SearchSection>
              <SearchBar>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchBar>
            </SearchSection>

            <PostFormCard>
              <PostForm onSubmit={handleSubmitPost}>
                <TitleInput
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title..."
                  required
                />
                <TextArea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts..."
                  required
                />
                <TopicSelector>
                  {topics.map(topic => (
                    <TopicChip
                      key={topic.id}
                      type="button"
                      $active={selectedTopic === topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                    >
                      {topic.icon} {topic.title}
                    </TopicChip>
                  ))}
                </TopicSelector>
                <InputRow>
                  <UsernameInput
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                  <PostButton type="submit" disabled={loading || !postTitle.trim() || !newPost.trim() || !username.trim()}>
                    Post Discussion
                  </PostButton>
                </InputRow>
              </PostForm>
            </PostFormCard>

            <FilterSection>
              <FilterTitle>
                <FaFilter /> Filter by Topic
              </FilterTitle>
              <TopicFilter>
                <TopicFilterItem
                  $active={filterTopic === 'all'}
                  onClick={() => setFilterTopic('all')}
                >
                  <TopicName>All Topics</TopicName>
                  <PostCount>{topicCounts.all}</PostCount>
                </TopicFilterItem>
                {topics.map(topic => (
                  <TopicFilterItem
                    key={topic.id}
                    $active={filterTopic === topic.id}
                    onClick={() => setFilterTopic(topic.id)}
                  >
                    <TopicName>
                      <span>{topic.icon}</span>
                      {topic.title}
                    </TopicName>
                    <PostCount>{topicCounts[topic.id]}</PostCount>
                  </TopicFilterItem>
                ))}
              </TopicFilter>
            </FilterSection>
          </StickySection>
        </LeftColumn>

        <MainColumn>
          <SortSection>
            {sortOptions.map(option => (
              <SortButton
                key={option.id}
                $active={sortBy === option.id}
                onClick={() => setSortBy(option.id)}
              >
                {option.label}
              </SortButton>
            ))}
          </SortSection>

          <PostsList>
            {filteredAndSortedPosts.length === 0 ? (
              <NoPostsMessage>
                {searchQuery ? 
                  'No posts found matching your search.' : 
                  'No posts yet. Be the first to start a discussion!'}
              </NoPostsMessage>
            ) : (
              filteredAndSortedPosts.map(post => {
                const isExpanded = expandedPosts[post.id];
                const contentLength = post.content.length;
                const shouldShowExpand = contentLength > 200;
                const visibleComments = showAllComments[post.id] ? post.comments : post.comments?.slice(0, 2);
                const hasMoreComments = post.comments?.length > 2;

                return (
                  <PostCard key={post.id}>
                    <PostTitle>{post.title || post.content.substring(0, 50) + '...'}</PostTitle>
                    <PostMeta>
                      <MetaItem>
                        <FaPaw /> {post.authorName}
                      </MetaItem>
                      <MetaItem>
                        <PostTag>{getTopicInfo(post.topic).title}</PostTag>
                      </MetaItem>
                      <MetaItem>{formatTime(post.createdAt)}</MetaItem>
                    </PostMeta>
                    
                    <PostContent className={!isExpanded && shouldShowExpand ? 'collapsed' : ''}>
                      {post.content}
                    </PostContent>
                    
                    {shouldShowExpand && (
                      <ExpandButton onClick={() => togglePostExpansion(post.id)}>
                        {isExpanded ? (
                          <>See less <FaChevronUp /></>
                        ) : (
                          <>See more <FaChevronDown /></>
                        )}
                      </ExpandButton>
                    )}

                    <PostActions>
                      <ActionButton
                        className={post.likedBy?.includes(userId) ? 'liked' : ''}
                        onClick={() => handleLike(post.id, post.likes || 0, post.likedBy)}
                      >
                        <FaHeart /> {post.likes || 0} Likes
                      </ActionButton>
                      <ActionButton>
                        <FaComment /> {post.comments?.length || 0} Comments
                      </ActionButton>
                      <ActionButton onClick={() => handleShare(post)}>
                        <FaShare /> Share
                      </ActionButton>
                    </PostActions>
                    
                    {(post.comments?.length > 0 || true) && (
                      <CommentsSection>
                        {visibleComments && visibleComments.length > 0 && (
                          <CommentsList>
                            {visibleComments.map((comment, idx) => {
                              const commentKey = `${post.id}-${idx}`;
                              const isCommentExpanded = expandedComments[commentKey];
                              const shouldShowCommentExpand = comment.text.length > 150;
                              
                              return (
                                <Comment key={idx}>
                                  <CommentHeader>
                                    <CommentAuthor>{comment.authorName}</CommentAuthor>
                                    <CommentTime>{formatTime(comment.createdAt)}</CommentTime>
                                  </CommentHeader>
                                  <CommentText className={!isCommentExpanded && shouldShowCommentExpand ? 'collapsed' : ''}>
                                    {comment.text}
                                  </CommentText>
                                  {shouldShowCommentExpand && (
                                    <ExpandButton onClick={() => toggleCommentExpansion(post.id, idx)}>
                                      {isCommentExpanded ? 'See less' : 'See more'}
                                    </ExpandButton>
                                  )}
                                </Comment>
                              );
                            })}
                          </CommentsList>
                        )}
                        
                        {hasMoreComments && (
                          <ShowMoreComments onClick={() => toggleShowAllComments(post.id)}>
                            {showAllComments[post.id] ? 
                              'Show less comments' : 
                              `View all ${post.comments.length} comments`}
                          </ShowMoreComments>
                        )}
                        
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
                      </CommentsSection>
                    )}
                  </PostCard>
                );
              })
            )}
          </PostsList>
        </MainColumn>

        <RightColumn>
          <StickySection>
            <GuidelinesCard>
              <GuidelinesTitle>
                <FaBook /> Community Guidelines
              </GuidelinesTitle>
              <GuidelinesList>
                <GuidelineItem>
                  Be respectful and kind to all members
                </GuidelineItem>
                <GuidelineItem>
                  Share accurate information only
                </GuidelineItem>
                <GuidelineItem>
                  No spam or self-promotion
                </GuidelineItem>
                <GuidelineItem>
                  Keep discussions dog-related
                </GuidelineItem>
                <GuidelineItem>
                  Report inappropriate content
                </GuidelineItem>
                <GuidelineItem>
                  Have fun and make friends!
                </GuidelineItem>
              </GuidelinesList>
            </GuidelinesCard>
          </StickySection>
        </RightColumn>
      </DesktopLayout>
    </ForumContainer>
  );
}

export default ForumImproved;