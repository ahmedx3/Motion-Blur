#version 300 es
precision highp float;

//TODO: Modify as needed

in vec2 v_screencoord;
in vec3 v_NDC;

out vec4 color;
uniform mat4 VP;
uniform mat4 prevVP;
uniform sampler2D color_sampler;
uniform sampler2D depth_sampler;
uniform sampler2D motion_sampler;

void main(){
    mat4 currInv = inverse(VP);
    ivec2 size = textureSize(color_sampler, 0); // This will give us the size of a mip level of the texture
    vec2 texelSize = 1.0/vec2(size); // 1/size = the change in texture coordinates between a pixel and its neighbors

    float depth = texture(depth_sampler, v_screencoord).x; // read the depth from the depth texture
    vec4 currNDC = vec4(2.0*v_screencoord.x-1.0, 2.0*v_screencoord.y-1.0, 2.0*depth-1.0, 1.0); 
    vec4 currWorld = currInv * currNDC;
    vec4 motion = texture(motion_sampler,v_screencoord);
    vec4 prevWorld = currWorld - motion;
    vec4 prevNDC = prevVP * prevWorld ;
    vec2 diff = (currNDC - prevNDC).xy;
    color =vec4(0.0f);
    for(int i =0 ; i< 10 ; i++)
    {
        color+=texture(color_sampler, v_screencoord - float(i)*(diff.xy * texelSize));
    }
    color/=10.0f;
    //color=texture(color_sampler, v_screencoord );
    
}