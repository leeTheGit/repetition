/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: false,
    // logging: {
    //     fetches: {
    //         fullUrl: true
    //     }
    // },
    output: 'standalone',
    webpack: (config) => {
        config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:
                    'repetition-uploads-068c3211e9f7.s3.ap-southeast-2.amazonaws.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname:
                    'elcyen-leeneenan-storeuploads-casvesfk.s3.ap-southeast-2.amazonaws.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname:
                    'elcyen-prod-storeuploads-tezkaofv.s3.ap-southeast-2.amazonaws.com',
                port: '',
            },

            
            {
                protocol: 'https',
                hostname: 'icotar.com',
                port: '',
            },
        ],
    },
}

export default nextConfig
