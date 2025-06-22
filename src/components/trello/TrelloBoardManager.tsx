
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, AlertCircle, RefreshCw, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TypeScript interfaces for Trello API responses
interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  pos: number;
  subscribed: boolean;
  idBoard: string;
}

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  idList: string;
  idBoard: string;
  dateLastActivity: string;
  due: string | null;
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  members: Array<{
    id: string;
    fullName: string;
    username: string;
  }>;
  url: string;
}

interface TrelloBoardData {
  lists: TrelloList[];
  cards: TrelloCard[];
}

interface TrelloBoardManagerProps {
  apiKey?: string;
  token?: string;
  boardId?: string;
}

export const TrelloBoardManager: React.FC<TrelloBoardManagerProps> = ({
  apiKey = "your_trello_api_key_here",
  token = "your_trello_token_here", 
  boardId = "your_board_id_here"
}) => {
  const [boardData, setBoardData] = useState<TrelloBoardData>({ lists: [], cards: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCardData, setNewCardData] = useState({ name: '', desc: '', listId: '' });
  const [creatingCard, setCreatingCard] = useState(false);
  const { toast } = useToast();

  // Fetch board data (lists and cards)
  const fetchBoardData = async () => {
    if (!apiKey || !token || !boardId || 
        apiKey === "your_trello_api_key_here" || 
        token === "your_trello_token_here" || 
        boardId === "your_board_id_here") {
      setError("Please provide valid API key, token, and board ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch lists and cards in parallel for better performance
      const [listsResponse, cardsResponse] = await Promise.all([
        fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`),
        fetch(`https://api.trello.com/1/boards/${boardId}/cards?filter=open&key=${apiKey}&token=${token}`)
      ]);

      // Check for API errors
      if (!listsResponse.ok) {
        throw new Error(`Failed to fetch lists: ${listsResponse.status} ${listsResponse.statusText}`);
      }
      if (!cardsResponse.ok) {
        throw new Error(`Failed to fetch cards: ${cardsResponse.status} ${cardsResponse.statusText}`);
      }

      const lists: TrelloList[] = await listsResponse.json();
      const cards: TrelloCard[] = await cardsResponse.json();

      // Sort lists by position
      const sortedLists = lists.filter(list => !list.closed).sort((a, b) => a.pos - b.pos);

      setBoardData({ lists: sortedLists, cards });
      
      toast({
        title: "Board Data Loaded",
        description: `Found ${sortedLists.length} lists and ${cards.length} cards`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Trello API Error:', err);
      
      toast({
        title: "Error Loading Board",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new card in specified list
  const createCard = async () => {
    if (!newCardData.name.trim() || !newCardData.listId) {
      toast({
        title: "Invalid Input",
        description: "Please provide card name and select a list",
        variant: "destructive"
      });
      return;
    }

    setCreatingCard(true);

    try {
      const response = await fetch('https://api.trello.com/1/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCardData.name,
          desc: newCardData.desc,
          idList: newCardData.listId,
          key: apiKey,
          token: token
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create card: ${response.status} ${response.statusText}`);
      }

      const newCard: TrelloCard = await response.json();
      
      // Add the new card to our local state
      setBoardData(prev => ({
        ...prev,
        cards: [...prev.cards, newCard]
      }));

      // Reset form
      setNewCardData({ name: '', desc: '', listId: '' });

      toast({
        title: "Card Created",
        description: `Successfully created "${newCard.name}"`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create card';
      console.error('Create card error:', err);
      
      toast({
        title: "Error Creating Card",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setCreatingCard(false);
    }
  };

  // Get cards for a specific list
  const getCardsForList = (listId: string): TrelloCard[] => {
    return boardData.cards.filter(card => card.idList === listId && !card.closed);
  };

  // Load data on component mount
  useEffect(() => {
    fetchBoardData();
  }, [apiKey, token, boardId]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Trello Board Manager</h2>
          <p className="text-muted-foreground">
            Manage your Trello lists and cards with proper mapping
          </p>
        </div>
        <Button onClick={fetchBoardData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create New Card Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Card
          </CardTitle>
          <CardDescription>
            Add a new card to any list on this board
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Card Name *</Label>
              <Input
                id="card-name"
                placeholder="Enter card name..."
                value={newCardData.name}
                onChange={(e) => setNewCardData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-select">Target List *</Label>
              <select
                id="list-select"
                className="w-full p-2 border rounded-md"
                value={newCardData.listId}
                onChange={(e) => setNewCardData(prev => ({ ...prev, listId: e.target.value }))}
              >
                <option value="">Select a list...</option>
                {boardData.lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-desc">Description (Optional)</Label>
            <Input
              id="card-desc"
              placeholder="Enter card description..."
              value={newCardData.desc}
              onChange={(e) => setNewCardData(prev => ({ ...prev, desc: e.target.value }))}
            />
          </div>
          <Button 
            onClick={createCard} 
            disabled={creatingCard || !newCardData.name.trim() || !newCardData.listId}
            className="w-full"
          >
            {creatingCard ? 'Creating...' : 'Create Card'}
          </Button>
        </CardContent>
      </Card>

      {/* Board Lists and Cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold">Board Lists</h3>
          <Badge variant="secondary">
            {boardData.lists.length} lists, {boardData.cards.length} total cards
          </Badge>
        </div>

        {boardData.lists.length === 0 && !loading ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Lists Found</AlertTitle>
            <AlertDescription>
              This board doesn't have any open lists, or the board ID might be incorrect.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {boardData.lists.map(list => {
              const listCards = getCardsForList(list.id);
              
              return (
                <Card key={list.id} className="flex flex-col h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{list.name}</span>
                      <Badge variant="outline">{listCards.length} cards</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {listCards.length === 0 ? (
                      <p className="text-muted-foreground italic">No cards in this list</p>
                    ) : (
                      <div className="space-y-3">
                        {listCards.map(card => (
                          <div key={card.id} className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{card.name}</h4>
                              {card.due && (
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Due
                                </Badge>
                              )}
                            </div>
                            
                            {card.desc && (
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {card.desc}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {card.labels.slice(0, 3).map(label => (
                                  <div
                                    key={label.id}
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: label.color || '#ccc' }}
                                    title={label.name}
                                  />
                                ))}
                              </div>
                              
                              {card.members.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span className="text-xs">{card.members.length}</span>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full mt-2 text-xs"
                              onClick={() => window.open(card.url, '_blank')}
                            >
                              View in Trello
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
