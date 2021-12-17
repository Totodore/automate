import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ProgressService } from "../services/progress.service";

export class ApiUtil {

  constructor(
    protected http: HttpClient,
    protected progress: ProgressService
  ) { }

  public readonly root: string = environment.apiLink;

  protected async get<R>(path: string, token?: string) {
    try {
      this.progress.show();
      if (path.startsWith("/"))
        path = path.substring(1);
      return await this.http.get<R>(`${this.root}/${path}`, { headers: token ? { 'Authorization': `Bearer ${token}`} : this.headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }
  protected async post<Q, R>(path: string, body: Q) {
    try {
      if (path.startsWith("/"))
        path = path.substring(1);
      return await this.http.post<R>(`${this.root}/${path}`, body, { headers: this.headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }
  protected async patch<Q, R>(path: string, body?: Q) {
    try {
      if (path.startsWith("/"))
        path = path.substring(1);
      return this.http.patch<R>(`${this.root}/${path}`, body, { headers: this.headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }
  protected async delete<R>(path: string) {
    try {
      if (path.startsWith("/"))
        path = path.substring(1);
      return this.http.delete<R>(`${this.root}/${path}`, { headers: this.headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }

  public get token(): string {
    return localStorage.getItem("jwt") as string;
  }
  
  public get logged(): boolean {
    return this.token != null;
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({ "Authorization": this.token ? `Bearer ${this.token}` : "" });
  }
}