uniform samplerCube reflectionMap;

#define LOD_ENABLED

#ifdef LOD_ENABLED
#ifdef WEBGL
  #extension GL_EXT_shader_texture_lod : require
#else
  #extension GL_ARB_shader_texture_lod : require
#endif
#endif

void getReflection(inout FragData data) {
  vec3 eyeDirWorld = vec3(invViewMatrix * vec4(data.eyeDirView, 0.0));
  vec3 reflectionWorld = reflect(-eyeDirWorld, data.normalWorld); //eye coordinates reflection vector

  float lod = data.roughness * maxMipMapLevel;
  float upLod = floor(lod);
  float downLod = ceil(lod);
  vec4 a = textureCubeLod(reflectionMap, fixSeams(reflectionWorld, upLod), upLod);
  vec4 b = textureCubeLod(reflectionMap, fixSeams(reflectionWorld, downLod), downLod);

  data.reflectionColor = data.specularity * mix(a, b, lod - upLod).rgb;
}
