import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import CreditCardSection from '../components/CreditCardSection';
import Footer from '../components/Footer';
function Home() {
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.innerHTML = ''; // Clear previous canvas if any
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (sceneRef.current) {
      sceneRef.current.appendChild(renderer.domElement);
    }

    renderer.setClearColor(0x000000, 0); // Transparent background

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      'assets/3d/CenturionCard3D.glb', (gltf) => {
        modelRef.current = gltf.scene;
        scene.add(gltf.scene);
        modelRef.current.position.set(0, 0, 0); // Adjust as needed
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    camera.position.z = 4;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (modelRef.current) {
        modelRef.current.rotation.y = scrollY * 0.002;
        modelRef.current.rotation.x = scrollY * 0.001;
        modelRef.current.position.y = -scrollY * 0.005;
      }
    };

    window.addEventListener('scroll', handleScroll);


    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;

      const xRotation = (clientY - halfHeight) / halfHeight; // Range: -1 to 1
      const yRotation = (clientX - halfWidth) / halfWidth;

      if (modelRef.current) {
        modelRef.current.rotation.x = xRotation * 0.3; // Minimal sensitivity
        modelRef.current.rotation.y = yRotation * 0.3;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);


    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with your financial planning today?", isBot: true }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const responseMap = {
    greeting: "Hello! How can I assist you with your financial planning today?",
    help: "I am here to assist you with financial planning. How can I help you today?",
    investment: "We can help you track your investments and performance.",
    advice: "Get expert advice on how to manage your finances effectively!",
    signup: "You can sign up to start managing your finances today!",
    "how to invest": "Investing is a great way to grow your wealth! We can guide you on the best strategies based on your goals.",
    "what is": "Please specify what you're asking about, and I'll provide more details.",
    inappropriate: "Sorry, I can't assist with that request.",
    
    default: "I'm sorry, I didn't understand that. Could you rephrase?"
  };

  const handleUserInput = (e) => setUserInput(e.target.value);

  const containsInappropriateContent = (message) => {
    const inappropriateWords = ['sex', 'adult', 'porn', 'xxx', 'inappropriate', 'abuse'];
    return inappropriateWords.some(word => message.toLowerCase().includes(word));
  };

  const getBotResponse = (userMessage) => {
    if (containsInappropriateContent(userMessage)) {
      return responseMap.inappropriate;
    }

    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hello")) {
      return responseMap.greeting;
    }
    if (lowerCaseMessage.includes("help")) {
      return responseMap.help;
    }
    for (const key in responseMap) {
      if (lowerCaseMessage.includes(key)) {
        return responseMap[key];
      }
    }
    return responseMap.default;
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { text: userInput, isBot: false }]);
      setUserInput('');

      setIsTyping(true);
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: getBotResponse(userInput), isBot: true }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="home">

      <div className="threeD-container" ref={sceneRef} style={{ width: '100vw', height: '100vh' }}></div>

      <div className={`chatbot-container ${isChatOpen ? 'open' : ''}`}>
        <div className="chatbot-header" onClick={toggleChat}>
          <p>💬 Chat with us</p>
        </div>
        {isChatOpen && (
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}>
                  <p>{message.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="message bot-message">
                  <p>...</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input-container">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Type your message..."
                value={userInput}
                onChange={handleUserInput}
                onKeyPress={handleKeyPress}
              />
              <button onClick={handleSendMessage} className="chatbot-send-btn">Send</button>
            </div>
          </div>
        )}
      </div>


      <section className="home-section-105">
      <div className="content-container-105">
        <h1 className="title-105">
          Plan Your <span className="highlight-105">Finances</span> Like a Pro
        </h1>
        <p className="subtitle-105">
          Track and manage your wealth with cutting-edge tools and insights. Start your financial journey today.
        </p>
        <button onClick={() => handleNavigate('/profile-detail')} className="cta-button-105">Get Started</button>
      </div>
      <div className="animation-container-105">
        <div className="circle-animation-105"></div>
        <div className="square-animation-105"></div>
        <div className="triangle-animation-105"></div>
      </div>
    </section>


 {/* Second Section */}
 <section className="home-section-205">
        <div className="content-container-205">
          <h1 className="title-205">
            Welcome to the <span className="highlight-205">Future</span> of Financial Planning
          </h1>
          <p className="subtitle-205">
            Our platform offers personalized tools to empower your journey. Experience the ease of smart budgeting.
          </p>
          <button onClick={() => handleNavigate('/financial-plan')} className="cta-button-205">Explore Features</button>
        </div>
        <div className="animation-container-105">
        <div className="circle-animation-105"></div>
        <div  className="square-animation-105"></div>
        <div  className="triangle-animation-105"></div>
      </div>
      </section>


<CreditCardSection/>





     <Footer/>
    </div>
  );
}

export default Home;
