import { UserManager } from "oidc-client-ts";

const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_hDqf76tNm",
    client_id: "1ohvbqs93102i8qkn372coj3f3",
    redirect_uri: "https://main.d2iait8vd00nr8.amplifyapp.com/",
    response_type: "code",
    scope: "aws.cognito.signin.user.admin email openid phone profile"
};

// create a UserManager instance
export const userManager = new UserManager({
    ...cognitoAuthConfig,
});

export async function signOutRedirect () {
    const clientId = "1ohvbqs93102i8qkn372coj3f3";
    const logoutUri = "https://main.d2iait8vd00nr8.amplifyapp.com/logout.html";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};
