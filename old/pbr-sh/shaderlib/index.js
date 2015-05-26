var fs = require('fs');

module.exports = {
  albedoConst: fs.readFileSync(__dirname + '/albedoConst.frag', 'utf8'),
  albedoTex: fs.readFileSync(__dirname + '/albedoTex.frag', 'utf8'),
  albedoGen: fs.readFileSync(__dirname + '/albedoGen.frag', 'utf8'),
  roughnessConst: fs.readFileSync(__dirname + '/roughnessConst.frag', 'utf8'),
  roughnessTex: fs.readFileSync(__dirname + '/roughnessTex.frag', 'utf8'),
  roughnessGen: fs.readFileSync(__dirname + '/roughnessGen.frag', 'utf8'),
  specularConst: fs.readFileSync(__dirname + '/specularConst.frag', 'utf8'),
  specularTex: fs.readFileSync(__dirname + '/specularTex.frag', 'utf8'),
  specularGen: fs.readFileSync(__dirname + '/specularGen.frag', 'utf8'),
  baseVert: fs.readFileSync(__dirname + '/base.vert', 'utf8'),
  baseFrag: fs.readFileSync(__dirname + '/base.frag', 'utf8'),
  startVert: fs.readFileSync(__dirname + '/start.vert', 'utf8'),
  startFrag: fs.readFileSync(__dirname + '/start.frag', 'utf8'),
  endVert: fs.readFileSync(__dirname + '/end.vert', 'utf8'),
  endFrag: fs.readFileSync(__dirname + '/end.frag', 'utf8'),
  transform: fs.readFileSync(__dirname + '/transform.vert', 'utf8'),
  correctGammaInput: fs.readFileSync(__dirname + '/correctGammaInput.glsl', 'utf8'),
  correctGammaOutput: fs.readFileSync(__dirname + '/correctGammaOutput.glsl', 'utf8'),
  sampleTexture2D: fs.readFileSync(__dirname + '/sampleTexture2D.frag', 'utf8'),
  sampleTexture2DTriPlanar: fs.readFileSync(__dirname + '/sampleTexture2DTriPlanar.frag', 'utf8'),
  lambert:  fs.readFileSync(__dirname + '/lambert.glsl', 'utf8'),
  phong:  fs.readFileSync(__dirname + '/phong.glsl', 'utf8'),
  lightDiffuseLambert:  fs.readFileSync(__dirname + '/lightDiffuseLambert.frag', 'utf8'),
  lightSpecularPhong:  fs.readFileSync(__dirname + '/lightSpecularPhong.frag', 'utf8'),
  fresnelSchlick:  fs.readFileSync(__dirname + '/fresnelSchlick.frag', 'utf8'),
  reflectionCubeMap:  fs.readFileSync(__dirname + '/reflectionCubeMap.frag', 'utf8'),
  irradianceCubeMap:  fs.readFileSync(__dirname + '/irradianceCubeMap.frag', 'utf8'),
  tonemapReinhard:  fs.readFileSync(__dirname + '/tonemapReinhard.glsl', 'utf8'),
  fixSeams:  fs.readFileSync(__dirname + '/fixSeams.glsl', 'utf8'),
  fixSeamsNone:  fs.readFileSync(__dirname + '/fixSeamsNone.glsl', 'utf8'),
  noise3:  fs.readFileSync(__dirname + '/noise3.glsl', 'utf8'),
}