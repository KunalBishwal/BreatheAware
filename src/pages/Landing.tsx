import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import SceneBreathe from '../components/landing/SceneBreathe';
import SceneDetect from '../components/landing/SceneDetect';
import SceneMap from '../components/landing/SceneMap';
import SceneUnderstand from '../components/landing/SceneUnderstand';
import SceneCompare from '../components/landing/SceneCompare';
import SceneAct from '../components/landing/SceneAct';
import ScrollProgress from '../components/landing/ScrollProgress';

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, setScrollProgress, setCurrentScene } = useAppStore();
  const [enteredDashboard, setEnteredDashboard] = useState(false);

  useEffect(() => {
    if (enteredDashboard) {
      navigate('/dashboard');
    }
  }, [enteredDashboard, navigate]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  // IntersectionObserver for scene detection
  useEffect(() => {
    const scenes = document.querySelectorAll('[data-scene]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sceneIndex = parseInt(entry.target.getAttribute('data-scene') || '0');
            setCurrentScene(sceneIndex);
          }
        });
      },
      { threshold: 0.5 }
    );

    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, [setCurrentScene]);

  const handleEnterDashboard = () => {
    if (!isAuthenticated) {
      useAppStore.getState().login('Guest', true);
    }
    setEnteredDashboard(true);
  };

  return (
    <div ref={containerRef} className="relative bg-bg-primary noise-bg">
      <ScrollProgress />
      
      <div data-scene="0">
        <SceneBreathe />
      </div>
      
      <div data-scene="1">
        <SceneDetect />
      </div>
      
      <div data-scene="2">
        <SceneMap />
      </div>
      
      <div data-scene="3">
        <SceneUnderstand />
      </div>
      
      <div data-scene="4">
        <SceneCompare />
      </div>
      
      <div data-scene="5">
        <SceneAct onEnterDashboard={handleEnterDashboard} />
      </div>
    </div>
  );
}
