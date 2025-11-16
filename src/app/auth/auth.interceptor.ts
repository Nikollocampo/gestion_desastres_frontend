import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) {
      return next(req);
    }
    const user = JSON.parse(raw) as { token?: string } | null;
    const token = user?.token;
    if (!token) {
      return next(req);
    }
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  } catch {
    return next(req);
  }
};
