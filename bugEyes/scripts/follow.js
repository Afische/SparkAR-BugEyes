// Load in modules
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');

// Enable async/await
(async function(){

// Find eye bones
const eyeLBones = await Scene.root.findByPath('**/Joint*');
const eyeRBones = await Scene.root.findByPath('**/Bone*');

// Create reference of the face
const face = FaceTracking.face(0);

const faceSignalX = FaceTracking.face(0).cameraTransform.x.expSmooth(90);
const faceSignalX2 = FaceTracking.face(0).cameraTransform.x.expSmooth(100);

const faceSignalY = FaceTracking.face(0).cameraTransform.y.expSmooth(90);
const faceSignalY2 = FaceTracking.face(0).cameraTransform.y.expSmooth(100);

const faceSignalZ = FaceTracking.face(0).cameraTransform.z.expSmooth(90);
const faceSignalZ2 = FaceTracking.face(0).cameraTransform.z.expSmooth(100);

const scaleFactor = 200;

// Bind signal rotations
eyeLBones.forEach(function(bone){
  bone.transform.rotationZ = faceSignalX.sub(faceSignalX2).mul(scaleFactor);
  bone.transform.rotationX = faceSignalY.sub(faceSignalY2).mul(scaleFactor);
  bone.transform.rotationY = faceSignalZ.sub(faceSignalZ2).mul(scaleFactor);
})

eyeRBones.forEach(function(bone){
  bone.transform.rotationZ = faceSignalX.sub(faceSignalX2).mul(scaleFactor);
  bone.transform.rotationX = faceSignalY.sub(faceSignalY2).mul(scaleFactor);
  bone.transform.rotationY = faceSignalZ.sub(faceSignalZ2).mul(scaleFactor);
})

// Map mouth openness value to a certain range
const mouthOpenness = face.mouth.openness.toRange(1.0, 2.0);
const eyePosition = face.mouth.openness.toRange(0.0,-0.04);

// Find objects
const eyeL = await Scene.root.findFirst('EyeL');
const eyeR = await Scene.root.findFirst('EyeR');

// Bind the mouth signal to the eye scale
eyeL.transform.scale = Reactive.point(mouthOpenness, mouthOpenness, mouthOpenness);
eyeL.transform.position = Reactive.point(-0.035, eyePosition, -0.04);

eyeR.transform.scale = Reactive.point(mouthOpenness, mouthOpenness, mouthOpenness);
eyeR.transform.position = Reactive.point(0.035, eyePosition, -0.04);


})();