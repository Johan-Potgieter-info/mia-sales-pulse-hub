import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TrelloList {
  id: string;
  name: string;
}

interface TrelloCard {
  id: string;
  name: string;
  idList: string;
  desc?: string;
}

// Replace with your Trello API credentials and board ID
const API_KEY = "YOUR_TRELLO_KEY";
const TOKEN = "YOUR_TRELLO_TOKEN";
const BOARD_ID = "YOUR_BOARD_ID";

export const TrelloBoardViewer = () => {
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [cardsByList, setCardsByList] = useState<Record<string, TrelloCard[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newCardName, setNewCardName] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [newCardListId, setNewCardListId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedLists = await fetchLists();
      const fetchedCards = await fetchCards();
      const grouped: Record<string, TrelloCard[]> = {};
      fetchedCards.forEach((card) => {
        if (!grouped[card.idList]) grouped[card.idList] = [];
        grouped[card.idList].push(card);
      });
      setLists(fetchedLists);
      setCardsByList(grouped);
      setNewCardListId(fetchedLists[0]?.id ?? "");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async (): Promise<TrelloList[]> => {
    const url = new URL(`https://api.trello.com/1/boards/${BOARD_ID}/lists`);
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("token", TOKEN);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const msg = `Failed to fetch lists: ${res.status}`;
      throw new Error(msg);
    }
    return (await res.json()) as TrelloList[];
  };

  const fetchCards = async (): Promise<TrelloCard[]> => {
    const allCards: TrelloCard[] = [];
    let before: string | undefined;
    const limit = 1000;
    while (true) {
      const url = new URL(`https://api.trello.com/1/boards/${BOARD_ID}/cards`);
      url.searchParams.set("key", API_KEY);
      url.searchParams.set("token", TOKEN);
      url.searchParams.set("filter", "open");
      url.searchParams.set("limit", limit.toString());
      if (before) url.searchParams.set("before", before);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const msg = `Failed to fetch cards: ${res.status}`;
        throw new Error(msg);
      }
      const page = (await res.json()) as TrelloCard[];
      allCards.push(...page);
      if (page.length < limit) break;
      before = page[page.length - 1].id;
    }
    return allCards;
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardListId || !newCardName) return;
    setLoading(true);
    setError(null);
    try {
      const url = new URL("https://api.trello.com/1/cards");
      url.searchParams.set("key", API_KEY);
      url.searchParams.set("token", TOKEN);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idList: newCardListId,
          name: newCardName,
          desc: newCardDesc,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to create card: ${res.status}`);
      }

      const created = (await res.json()) as TrelloCard;
      setCardsByList((prev) => ({
        ...prev,
        [created.idList]: [created, ...(prev[created.idList] || [])],
      }));
      setNewCardName("");
      setNewCardDesc("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <Card key={list.id} className="bg-card">
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
              <CardDescription>
                {cardsByList[list.id]?.length || 0} cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-1">
                {cardsByList[list.id]?.map((card) => (
                  <li
                    key={card.id}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    {card.name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {lists.length > 0 && (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Create Card</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="list">List</Label>
                <select
                  id="list"
                  value={newCardListId}
                  onChange={(e) => setNewCardListId(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 bg-background"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Card Name</Label>
                <Input
                  id="name"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Card"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrelloBoardViewer;
