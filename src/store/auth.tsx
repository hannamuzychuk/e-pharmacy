import { createContext, useContext, useMemo, useState } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuth') === 'true')
        ;

    const login = () => {
        localStorage.setItem('isAuth', 'true');
        setIsAuthenticated(true);
        
    };

    const logout = () => {
        localStorage.setItem('isAuth', 'false');
        setIsAuthenticated(false);
    };

    const value = useMemo(
        () => ({
            isAuthenticated,
            login,
            logout,
        }), [isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}