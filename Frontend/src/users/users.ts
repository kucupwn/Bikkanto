const loginForm = document.getElementById("login-form") as HTMLFormElement;

class Users {
  private readonly apiUrl = "http://127.0.0.1:8000";

  public async login(username: string, password: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    this.getToken(formData);

    window.location.href = "/index.html";
  }

  private async getToken(formData: URLSearchParams): Promise<void> {
    const res = await fetch(`${this.apiUrl}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-urlencoded" },
      body: formData,
    });

    if (!res.ok) {
      alert("Invalid username or password!");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
  }
}

export const users = new Users();

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = (loginForm.username as HTMLInputElement).value;
  const password = (loginForm.password as HTMLInputElement).value;
  await users.login(username, password);
});
