#version 300 es
precision highp float;

//TODO: Modify as needed

in vec2 v_screencoord;

out vec4 color;
uniform mat4 currVP;
uniform mat4 prevVP;
uniform sampler2D color_sampler;
uniform sampler2D depth_sampler;
uniform sampler2D motion_sampler;

void main(){

    vec4 motion = texture(motion_sampler, v_screencoord);
    float depth = texture(depth_sampler, v_screencoord).x; // read the depth from the depth texture

    vec4 currPixelNDC = vec4(2.0*v_screencoord.x-1.0, 2.0*v_screencoord.y-1.0, 2.0*depth-1.0, 1.0);
    vec2 currSC = vec2(currPixelNDC.x/2.0+0.5f,currPixelNDC.y/2.0+0.5f);
    vec4 currWorldPos = inverse(currVP) * currPixelNDC;
    currWorldPos/=currWorldPos.w;
    vec4 prevWorldPos = currWorldPos - vec4(motion.xyz,0.0f); 

    vec4 prevPixelNDC = prevVP * prevWorldPos;
    prevPixelNDC/=prevPixelNDC.w;
    vec2 prevSC = vec2(prevPixelNDC.x/2.0+0.5f,prevPixelNDC.y/2.0+0.5f);
    vec2 delta = currSC - prevSC;
    //color = texture(color_sampler, currSC) ; // Sample texture color and send it as is
   // color = texture(color_sampler, prevSC) ; // Sample texture color and send it as is
    //color = (texture(color_sampler, prevSC) + texture(color_sampler, currSC) ) /2.0f;
    color = vec4(0);
    // Here we calculate a weighted mean from samples located on a radial direction
    for(int i = -10; i <= 10; i++){
        color += texture(color_sampler, v_screencoord + float(i)/10.0f*delta) ;
    }
    color /= 20.0;
}