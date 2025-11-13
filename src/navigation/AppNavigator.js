import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NewPostScreen from '../screens/NewPostScreen';
import VideosScreen from '../screens/VideosScreen';

export const AuthContext = createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);

  // sample in-memory users and posts
  const [users, setUsers] = useState([
    { id: '1', name: 'Maria', email: 'maria@example.com', username: 'maria', nickname: '', followers: [], following: [] },
    { id: '2', name: 'Ana', email: 'ana@example.com', username: 'ana', nickname: '', followers: [], following: [] },
  ]);

  const [posts, setPosts] = useState([]);

  // simple chat storage
  const [chats, setChats] = useState([]);

  const sendMessage = ({ chatId, fromEmail, text }) => {
    if (!chatId) return null;
    setChats((c) => c.map(ch => {
      if (ch.id !== chatId) return ch;
      return { ...ch, messages: [...ch.messages, { id: String(Date.now()), fromEmail, text }] };
    }));
  };

  const createChat = (participantEmails) => {
    const key = participantEmails.slice().sort().join('|');
    let existing = chats.find(ch => ch.participantsKey === key);
    if (existing) return existing;
    const chat = { id: String(Date.now()), participants: participantEmails, participantsKey: key, messages: [] };
    setChats(c => [chat, ...c]);
    return chat;
  };

  const addPost = ({ authorEmail, imageUri, caption, mediaType }) => {
    const newPost = { id: String(Date.now()), authorEmail, imageUri, caption, mediaType: mediaType || 'image', likes: [], comments: [] };
    setPosts((p) => [newPost, ...p]);
    return newPost;
  };

  const toggleLike = (postId, userEmail) => {
    setPosts((p) => p.map(post => {
      if (post.id !== postId) return post;
      const has = post.likes.includes(userEmail);
      return { ...post, likes: has ? post.likes.filter(l => l !== userEmail) : [...post.likes, userEmail] };
    }));
  };

  const addComment = (postId, userEmail, text) => {
    setPosts((p) => p.map(post => {
      if (post.id !== postId) return post;
      return { ...post, comments: [...post.comments, { id: String(Date.now()), userEmail, text }] };
    }));
  };

  const deletePost = (postId, requesterEmail) => {
    // remove post only if requester is the author
    setPosts((p) => p.filter(post => !(post.id === postId && post.authorEmail === requesterEmail)));
  };

  const toggleFollow = (fromEmail, toEmail) => {
    if (!fromEmail || !toEmail || fromEmail === toEmail) return;
    setUsers((list) => list.map(u => {
      if (u.email === fromEmail) {
        const isFollowing = (u.following || []).includes(toEmail);
        return { ...u, following: isFollowing ? (u.following || []).filter(f => f !== toEmail) : [...(u.following || []), toEmail] };
      }
      if (u.email === toEmail) {
        const isFollowed = (u.followers || []).includes(fromEmail);
        return { ...u, followers: isFollowed ? (u.followers || []).filter(f => f !== fromEmail) : [...(u.followers || []), fromEmail] };
      }
      return u;
    }));
  };

  const searchUsers = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.nickname || '').toLowerCase().includes(q));
  };

  const auth = {
    user,
    users,
    posts,
    createChat,
    signIn: ({ email, password }) => {
      const existing = users.find(u => u.email === email);
      if (existing) {
        // if a password is set, validate
        if (existing.password && password && existing.password !== password) {
          // eslint-disable-next-line no-alert
          alert('Senha incorreta');
          return;
        }
        setUser({ email });
        return;
      }
      // create user if not exists
  const newU = { id: String(Date.now()), name: email.split('@')[0], email, password, username: email.split('@')[0], nickname: '', followers: [], following: [] };
      setUsers((s) => [newU, ...s]);
      setUser({ email });
    },
    signOut: () => setUser(null),
    signUp: ({ email, password, phone, dob }) => {
      if (!users.find(u => u.email === email)) {
        const newU = { id: String(Date.now()), name: email.split('@')[0], email, password, phone, dob, username: email.split('@')[0], nickname: '', followers: [], following: [] };
        setUsers((s) => [newU, ...s]);
      }
      setUser({ email });
    },
    updateProfile: ({ email, name, username, nickname, bio }) => {
      setUsers((s) => s.map(u => u.email === email ? { ...u, name: name || u.name, username: username || u.username, nickname: nickname || u.nickname, bio: bio || u.bio } : u));
    },
    toggleFollow,
    chats,
    sendMessage,
    deletePost,
    addPost,
    toggleLike,
    addComment,
    searchUsers,
  };
  function MainTabs() {
    return (
        <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: '#777',
          tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee', height: 72, paddingBottom: 8 },
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 6 },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <MaterialCommunityIcons name="chat" size={24} style={{ marginRight: 12 }} onPress={() => navigation.navigate('Chats')} />
            ),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            title: 'Feed'
          })}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={size} />
            ),
            title: 'Pesquisar'
          }}
        />

        <Tab.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.newPostButton}>
                <MaterialCommunityIcons name="plus" color="#fff" size={28} />
              </View>
            ),
            title: 'Publicar'
          }}
        />

        <Tab.Screen
          name="Videos"
          component={VideosScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="video" color={color} size={size} />
            ),
            title: 'Vídeos'
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => {
              const me = users.find(u => u.email === user?.email) || {};
              const label = (me.name || user?.email || 'U').charAt(0).toUpperCase();
              return <Avatar.Text size={size} label={label} />;
            },
            title: 'Perfil'
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user == null ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="Chats" component={ChatListScreen} options={{ headerShown: true }} />
              <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true }} />
              <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  newPostButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  }
});
