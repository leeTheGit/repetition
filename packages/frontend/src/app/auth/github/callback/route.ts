import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import AccountRepository from "@repetition/core/auth/account/Repository"
import UserRepository from '@repetition/core/user/Repository'
import OrganisationRepository from "@repetition/core/organisation/Repository"
import { github } from "@repetition/frontend/lib/auth/auth";
import { CreateUserFromOauth } from '@repetition/core/user/actions/create-user-from-oauth'
import { isError } from "@repetition/core/types";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { Resource } from "sst";

const accountRepository = new AccountRepository()
const orgRepository = new OrganisationRepository()
const userRepository = new UserRepository

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''
// const APP_KEY = Resource.AppKey.value;



// note:  This callback is split into Signup and Signin flows
//        We must check a previously set cookie to determine which flow to run
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    let authIntentCookie = cookies().get("auth-intent")?.value ?? null;

    if (!authIntentCookie) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/auth/signup?error=missing_intent`
            }
        });
    }

    let [authIntent, intentDomain] = authIntentCookie.split(":")
    intentDomain = intentDomain ? intentDomain + "." : "" 

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("github_oauth_state")?.value ?? null;
    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: `http://${intentDomain}${PLATFORM_DOMAIN}/auth/${authIntent}?error=failed_verifying_auth_process`
            }
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });

        const githubUser: GitHubUser = await githubUserResponse.json();

        
        
        if (authIntent === 'signin') {
            const existingAccount = await accountRepository.fetchByGithubId(githubUser.id)

            if (isError(existingAccount)) {
                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: `http://${intentDomain}${PLATFORM_DOMAIN}/auth/signin?error=no_user_for_google`
                    }
                });
            }

            const user = existingAccount.user
            let domain = ""
            if (user?.organisationUuid) {
                const organisation = await orgRepository.fetchByUuid(user.organisationUuid)
                if (!isError(organisation)) {
                    domain = organisation.domain + '.'
                }
            }

            const data = new TextEncoder().encode(githubUser.id + existingAccount.userId);
            const hash = await sha256(data);
            const hexHash = encodeHex(hash);

            // http://test-org.localtest.me/api/auth/session?user=
            return new Response(null, {
                status: 302,
                headers: {
                    Location: `http://${domain}${PLATFORM_DOMAIN}/api/auth/session?type=github&oauthid=${githubUser.id}&user=${existingAccount.userId}&hash=${hexHash}`
                }
            });
        }

    // if (!githubUser.email) {
    //   const githubUserEmailResponse = await fetch(
    //     "https://api.github.com/user/emails",
    //     {
    //       headers: {
    //         Authorization: `Bearer ${tokens.accessToken}`,
    //       },
    //     }
    //   );
    //   const githubUserEmails = await githubUserEmailResponse.json();
    //   console.log(githubUserEmails)
    //   githubUser.email = getPrimaryEmail(githubUserEmails);
    // }

    // const userId = await createGithubUserUseCase(githubUser);


        // if (authIntent === 'signup') {
        //     const existingUser = await accountRepository.fetchByGithubId(githubUser.id)

        //     // let existingUser = await userRepository.fetchByEmail(githubUser.email);

        //     if (!isError(existingUser)) {
        //         return new Response(null, {
        //             status: 302,
        //             headers: {
        //                 Location: `http://${PLATFORM_DOMAIN}/auth/signup?error=User_already_exists`
        //             }
        //         });
        //     }

        //     const newUser = await CreateUserFromOauth("github", githubUser )
        //     if (isError(newUser)) {
        //         return new Response(null, {
        //             status: 500,
        //             headers: {
        //                 Location: `http://${PLATFORM_DOMAIN}/auth/signup?error=failed_to_create_user`                    }
        //         });
        //     }

        //     const platformDomain = PLATFORM_DOMAIN.split(':')[0]
        //     const session = await signupLucia.createSession(newUser.id, {});
        //     const sessionCookie = signupLucia.createSessionCookie(session.id);
        //     sessionCookie.attributes.domain = `.${platformDomain}`
        //     cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        //     return new Response(null, {
        //         status: 302,
        //         headers: {
        //             Location: "/account"
        //         }
        //     });
        // }




        // This base case should never run
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/?error=failed_verifying_auth_process_2"
            }
        });





    } catch (e) {
        console.error(e);
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400,
            });
        }
        return new Response(null, {
            status: 500,
        });
    }
}

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

// function getPrimaryEmail(emails: Email[]): string {
//   const primaryEmail = emails.find((email) => email.primary);
//   return primaryEmail!.email;
// }

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
