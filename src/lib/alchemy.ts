class AlchemyService {
  private endpoint: string = "https://eth-sepolia.g.alchemy.com/v2/dummy";

  async initialize() {
    if (typeof window !== "undefined") {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        this.endpoint = data.alchemyEndpoint;
      } catch (err) {
        console.error("Failed to fetch Alchemy endpoint:", err);
      }
    }
  }

  getEndpoint() {
    return this.endpoint;
  }
}

export const alchemyService = new AlchemyService();
