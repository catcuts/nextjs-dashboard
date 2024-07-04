import type { NextAuthConfig } from 'next-auth';

// 定义 authConfig 对象，用作 NextAuth 模块的配置（见 auth.ts）
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        // 执行授权（不论授权是否通过）后回调：
        //   如果用户已登录，将其重定向到仪表板；
        //   如果用户未登录，将其重定向到登录页面。
        // return true 来允许访问，或者返回 false 来阻止访问
        // （阻止访问会重定向到 pages.signIn 页面）。
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [],  // 身份验证功能提供者，用于验证用户身份（见 auth.ts 使用的是凭证即用户名密码的身份验证方式）
} satisfies NextAuthConfig;