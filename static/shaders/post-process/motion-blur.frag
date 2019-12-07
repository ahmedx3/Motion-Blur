#version 300 es
precision highp float;

//TODO: Modify as needed

in vec2 v_screencoord;

out vec4 color;

uniform sampler2D color_sampler;
uniform sampler2D depth_sampler;
uniform sampler2D motion_sampler;

uniform mat4 P_i; // Projection matrix inverse Current
uniform mat4 P_matPrev_i; // Projection matrix  Prev

uniform mat4 VPCurr;
uniform mat4 VPPrev;

uniform mat4 VCurr_i;
uniform mat4 VPrev_i;

void main(){

    vec4 motionVec = texture(motion_sampler, v_screencoord);
                                                                                                              
    float depth = texture(depth_sampler, v_screencoord).x;                                                     
    vec3 pixalPosNDC = vec3(2.0*v_screencoord.x-1.0, 2.0*v_screencoord.y-1.0, 2.0*depth-1.0) ;            
    vec4 pixelPosClip = P_matPrev_i * vec4(pixalPosNDC , 1.0);                                                                     
    vec3 pixelPosCam = pixelPosClip.xyz / pixelPosClip.w;
    vec3 PixelWorldPos = (inverse(VPrev_i)* vec4(pixelPosCam , 1.0) ).xyz;

    vec3 PixelWorldPosPrev = PixelWorldPos - motionVec.xyz;
    vec3 pixalCamPosPrev = (VPrev_i * vec4(PixelWorldPosPrev , 1.0)).xyz;
    vec4 pixalPosClipPrev = inverse(P_matPrev_i) * vec4(pixalCamPosPrev , 1.0);
    vec3 pixalposNDCPrev = pixalPosClipPrev.xyz / pixalPosClipPrev.w;

    vec2 pixalDiffNDC = pixalposNDCPrev.xy - pixalPosNDC.xy;

    vec3 col = vec3(0.0);
	float total_weight = 0.0;
	for (int i = 0; i < 50; i++)
	{
		vec2 offset = pixalDiffNDC * (float(i) / float(50) - 0.5) * 1.0; 
		col += texture(color_sampler, v_screencoord + offset).rgb;
		total_weight++;
	}
	color = vec4 ( col / total_weight , 1.0 );
}