import { useGLTF, Center, Float } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useRef, useState } from "react";
import { useTamagotchiStore } from "../store";
import { useCatStore } from "../state/catState";

export default function TamagotchiCusto(props) {
  const { textures, frameCount } = useTamagotchiStore();
  const { dispatch, getState } = useCatStore();
  const { scene } = useGLTF("./models/Tamagotchi/tamagotchi-custom.glb");
  const [state, setState] = useState(getState());

  // Sync with cat state
  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isSleeping = state.flags.isSleeping;
  const [isEating, setIsEating] = useState(false);

  // Load all texture variants upfront to prevent re-renders
  const mainTexture = textures.main
    ? useLoader(TextureLoader, textures.main)
    : null;

  const screenTexturesNormal = useLoader(
    TextureLoader,
    Array.from(
      { length: frameCount },
      (_, i) => `${textures.screen}${String(i + 1).padStart(4, "0")}.png`
    )
  );

  const screenTexturesSleep = useLoader(
    TextureLoader,
    Array.from(
      { length: frameCount },
      (_, i) => `${textures.sleep}${String(i + 1).padStart(4, "0")}.png`
    )
  );

  const screenTexturesEat = useLoader(
    TextureLoader,
    Array.from(
      { length: frameCount },
      (_, i) => `${textures.eat}${String(i + 1).padStart(4, "0")}.png`
    )
  );

  // Select active textures based on state
  const screenTextures = isSleeping
    ? screenTexturesSleep
    : isEating
    ? screenTexturesEat
    : screenTexturesNormal;

  // Configure all texture arrays
  useEffect(() => {
    [screenTexturesNormal, screenTexturesSleep, screenTexturesEat].forEach(textureArray => {
      if (textureArray && textureArray.length > 0) {
        textureArray.forEach((texture) => {
          texture.flipY = false;
          texture.needsUpdate = true;
        });
      }
    });
  }, [screenTexturesNormal, screenTexturesSleep, screenTexturesEat]);

  const screenRef = useRef();

  // Animation du screen
  useEffect(() => {
    if (!screenTextures || screenTextures.length === 0) return;

    let frameIndex = 0;
    const interval = setInterval(() => {
      if (screenRef.current && screenTextures[frameIndex]) {
        screenRef.current.material.map = screenTextures[frameIndex];
        screenRef.current.material.needsUpdate = true;
        frameIndex = (frameIndex + 1) % screenTextures.length;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [screenTextures, isSleeping, isEating]);

  // Appliquer les textures et couleurs aux matériaux du modèle
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        let materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          switch (mat.name) {
            case "text-main":
              if (mainTexture) {
                mat.map = mainTexture;
                mat.map.flipY = false;
                mat.map.needsUpdate = true;
              }
              break;
            case "text-screen":
              screenRef.current = child;
              if (screenTextures.length > 0) {
                mat.map = screenTextures[0];
                mat.needsUpdate = true;
              }
              break;
            case "text-ring":
              if (textures.ring) mat.color.set(textures.ring);
              break;
            case "text-button":
              if (textures.button) mat.color.set(textures.button);
              break;
          }
        });

        // Marquer les boutons comme cliquables
        if (["bouton1", "bouton2", "bouton3"].includes(child.name)) {
          child.userData.clickable = true;
          child.userData.isButton = true;
        }
      }
    });
  }, [scene, mainTexture, screenTextures, textures, isSleeping, isEating]);

  // Fonction pour jouer un son
  const playSound = (soundFile) => {
    const audio = new Audio(`./sounds/${soundFile}.mp3`);
    audio.play().catch(() => {}); // Suppress errors if audio fails
  };

  // Handle button clicks with sound (original controls)
  const handlePointerDown = (event) => {
    const clickedButton = event.object.name;
    
    // Check if clicked object is a button
    if (!["bouton1", "bouton2", "bouton3"].includes(clickedButton)) {
      return;
    }

    // Stop event propagation to prevent OrbitControls from interfering
    event.stopPropagation();
    
    const currentState = getState();

    switch (clickedButton) {
      case "bouton1":
        // Left button - sleep (toggles sleep animation)
        dispatch({ type: "SLEEP_TOGGLE" });
        setIsEating(false);
        playSound("sleep");
        break;
      case "bouton2":
        // Middle button - food (shows eating animation)
        // Turn off sleep if it's enabled
        if (currentState.flags.isSleeping) {
          dispatch({ type: "SLEEP_TOGGLE" });
        }
        setIsEating(true);
        // Auto-feed with first available food
        const foodItems = Object.keys(currentState.inventory.food).filter(
          (item) => currentState.inventory.food[item] > 0
        );
        if (foodItems.length > 0) {
          dispatch({ type: "FEED", payload: { item: foodItems[0] } });
        }
        setTimeout(() => setIsEating(false), 2000);
        playSound("eat");
        break;
      case "bouton3":
        // Right button - play (shows play animation)
        // Turn off sleep if it's enabled
        if (currentState.flags.isSleeping) {
          dispatch({ type: "SLEEP_TOGGLE" });
        }
        setIsEating(false);
        if (currentState.core.energy >= 10) {
          dispatch({ type: "PLAY" });
        }
        playSound("play");
        break;
      default:
        break;
    }
  };

  // Gestion du survol du modèle
  const handlePointerOver = (event) => {
    if (event.object.userData.isButton || ["bouton1", "bouton2", "bouton3"].includes(event.object.name)) {
      event.stopPropagation();
    }
  };

  return (
    <Float
      speed={3}
      rotationIntensity={1}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0]}
    >
      {scene ? (
        <primitive
          {...props}
          object={scene}
          castShadow
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
        />
      ) : (
        <p>Modèle non chargé...</p>
      )}
    </Float>
  );
}
