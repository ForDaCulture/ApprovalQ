import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { AppContext } from '../context/AppContext';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';

const LandingPage = () => {
  const { auth, navigate } = useContext(AppContext);
  const mountRef = useRef(null);
  let rendererInstance = null; // Store renderer to manage cleanup

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    rendererInstance = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererInstance.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) mountRef.current.appendChild(rendererInstance.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particlesGeometry.attributes.position.array.forEach((value, index) => {
        if (index % 3 === 0) {
          particlesGeometry.attributes.position.array[index] += Math.sin(Date.now() * 0.001 + index) * 0.01;
        }
      });
      particlesGeometry.attributes.position.needsUpdate = true;
      if (rendererInstance) rendererInstance.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      if (rendererInstance) rendererInstance.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const aurora1 = document.querySelector('.aurora-1');
      const aurora2 = document.querySelector('.aurora-2');
      if (aurora1) aurora1.style.transform = `translate(${scrollY * -0.1}px, ${scrollY * -0.1}px)`;
      if (aurora2) aurora2.style.transform = `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)`;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (mountRef.current && rendererInstance && rendererInstance.domElement) {
        mountRef.current.removeChild(rendererInstance.domElement);
      }
      rendererInstance.dispose(); // Clean up renderer
      rendererInstance = null; // Reset to avoid memory leaks
    };
  }, []);

  const handleLogin = async (providerType) => {
    try {
      if (providerType === 'google') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
      navigate('/onboarding');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleTryAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/onboarding');
    } catch (error) {
      console.error('Guest login error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden pt-16 font-sans">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-pulse aurora-1"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-4000 aurora-2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.section
          className="py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
            variants={itemVariants}
          >
            The Creative Chaos Ends Here
          </motion.h1>
          <motion.p
            className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Creative teams are drowning in disjointed tools, endless email threads, and delayed approvals. ApprovalQ reimagines your workflow with AI-driven creation and a seamless approval process, all in one sustainable cloud platform.
          </motion.p>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-12 py-20 bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-4">AI-Powered Ideation</h2>
            <p className="text-gray-400">
              Unleash your creativity with AI that generates first drafts for blogs, ads, and scripts in seconds. Break free from writer’s block and focus on what matters—refining your vision with real-time collaboration.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-4">Structured Refinement</h2>
            <p className="text-gray-400">
              Define multi-step approval flows tailored to your team’s needs. From Content Creators to Approvers, every stakeholder reviews in the right order, eliminating bottlenecks and email clutter.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          className="py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-4xl font-bold mb-6"
            variants={itemVariants}
          >
            Publish Anywhere, Instantly
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            Take your approved content live on blogs, Twitter, LinkedIn, and more with a single click. Our eco-friendly cloud ensures minimal carbon footprint while maximizing your reach.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4"
            variants={itemVariants}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogin('google')}
              className="px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Sign in with Google"
            >
              Start with Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTryAsGuest}
              className="px-8 py-4 border border-white/20 text-lg font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Try as Guest"
            >
              Try as Guest
            </motion.button>
          </motion.div>
        </motion.section>

        <motion.div
          className="py-10 text-center text-gray-500"
          variants={itemVariants}
        >
          <p className="text-sm">Try saying “Login with Google” or “Guest Mode” – voice control coming soon!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;