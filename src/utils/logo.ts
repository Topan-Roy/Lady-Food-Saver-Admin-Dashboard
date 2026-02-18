export const getAppLogo = () => {
    return localStorage.getItem('app_logo') || '/logo.png';
};

export const setAppLogo = (dataUrl: string) => {
    localStorage.setItem('app_logo', dataUrl);
};

export const resetAppLogo = () => {
    localStorage.removeItem('app_logo');
};
