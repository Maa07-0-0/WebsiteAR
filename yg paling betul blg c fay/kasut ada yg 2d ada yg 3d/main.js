import { loadGLTF, loadAudio } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/GROUP/blaf.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load the 3D models and their corresponding audio files
    const modelAudioMap = [
      { modelPath: '../../assets/models/blue-woman-shoe/scene.gltf', scale: 0.1, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/brothers_shoe/scene.gltf', scale: 0.1, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/caged-heels/scene.gltf', scale: 0.5, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/curvy-sandal-heels/scene.gltf', scale: 8, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/leather-shoes/scene.gltf', scale: 0.001, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/luxy-scarpin-luxury-heels/scene.gltf', scale: 3, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/miumiu_baby_pink_satin_ballet_pumps_heel/scene.gltf', scale: 0.5, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/nike-air-zoom-pegasus/scene.gltf', scale: 0.5, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/pointy_stiletto_v2/scene.gltf', scale: 5, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/scanned-adidas-sports-shoe/scene.gltf', scale: 1, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/scarpins-with-strap-model/scene.gltf', scale: 5, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/shoes/scene.gltf', scale: 0.5, audioPath: '../../assets/sounds/sound1.mp3' },
      { modelPath: '../../assets/models/unused-blue-vans-shoe/scene.gltf', scale: 0.3, audioPath: '../../assets/sounds/sound1.mp3' },
    ];

    const anchors = [
      11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13,
    ];

    const loadedModels = await Promise.all(modelAudioMap.map(async (entry, index) => {
      const loadedModel = await loadGLTF(entry.modelPath);
      loadedModel.scene.scale.set(entry.scale, entry.scale, entry.scale);
      loadedModel.scene.position.set(0, 0, 0);
      const anchor = mindarThree.addAnchor(anchors[index]);
      anchor.group.add(loadedModel.scene);
      return loadedModel.scene;
    }));

    const loadedAudios = await Promise.all(modelAudioMap.map(entry => loadAudio(entry.audioPath)));

    const clock = new THREE.Clock();

    // Create an audio listener and attach it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Create positional audio sources and attach them to the models
    const audioSources = loadedModels.map((model, index) => {
      const audio = new THREE.PositionalAudio(listener);
      model.add(audio);
      audio.setBuffer(loadedAudios[index]);
      audio.setRefDistance(100);
      audio.setLoop(false);
      return audio;
    });

    await mindarThree.start();

    const rotateModels = () => {
      const delta = clock.getDelta();
      loadedModels.forEach((model, index) => {
        if (index >= 6) { // Rotate only models 6-12
          model.rotation.y += delta; // Rotate around the Y-axis
        }
      });
    };

    const playAudioForModel = (index) => {
      const audio = audioSources[index];
      if (audio && !audio.isPlaying) {
        audio.play();
      }
    };

    renderer.setAnimationLoop(() => {
      rotateModels();
      renderer.render(scene, camera);
    });

    // Raycaster setup to detect clicks/touches
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onDocumentMouseDown = (event) => {
      event.preventDefault();

      // Update the mouse variable
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Find intersections
      raycaster.setFromCamera(mouse, camera);
      loadedModels.forEach((model, index) => {
        const intersects = raycaster.intersectObject(model, true);
        if (intersects.length > 0) {
          playAudioForModel(index);
        }
      });
    };

    // Add event listener for mouse down
    window.addEventListener('mousedown', onDocumentMouseDown, { once: true });
  };
  start();
});