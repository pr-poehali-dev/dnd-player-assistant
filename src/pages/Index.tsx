import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
}

interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  quantity: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

interface DiceRoll {
  id: string;
  dice: string;
  result: number;
  timestamp: number;
}

export default function Index() {
  const { toast } = useToast();
  const [isMaster, setIsMaster] = useState(false);
  const [activeTab, setActiveTab] = useState('character');

  const [character, setCharacter] = useState<Character>({
    id: '1',
    name: 'Герой',
    class: 'Воин',
    level: 1,
    hp: 12,
    maxHp: 12,
    ac: 16,
    stats: {
      str: 16,
      dex: 14,
      con: 15,
      int: 10,
      wis: 12,
      cha: 8,
    },
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Длинный меч', weight: 3, quantity: 1 },
    { id: '2', name: 'Зелье лечения', weight: 0.5, quantity: 3 },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Квест: Логово дракона',
      content: 'Найти древний артефакт в пещере',
      timestamp: Date.now(),
    },
  ]);

  const [diceHistory, setDiceHistory] = useState<DiceRoll[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    const roll: DiceRoll = {
      id: Date.now().toString(),
      dice: `d${sides}`,
      result,
      timestamp: Date.now(),
    };
    setDiceHistory([roll, ...diceHistory.slice(0, 9)]);
    
    toast({
      title: `🎲 Бросок d${sides}`,
      description: `Результат: ${result}`,
    });
  };

  const addInventoryItem = () => {
    if (!newItemName.trim()) return;
    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      weight: parseFloat(newItemWeight) || 0,
      quantity: 1,
    };
    setInventory([...inventory, item]);
    setNewItemName('');
    setNewItemWeight('');
    toast({
      title: 'Предмет добавлен',
      description: `${item.name} добавлен в инвентарь`,
    });
  };

  const removeInventoryItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
    toast({
      title: 'Предмет удалён',
      description: 'Предмет убран из инвентаря',
    });
  };

  const addNote = () => {
    if (!newNoteTitle.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      timestamp: Date.now(),
    };
    setNotes([note, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    toast({
      title: 'Заметка создана',
      description: newNoteTitle,
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateHP = (delta: number) => {
    setCharacter({
      ...character,
      hp: Math.max(0, Math.min(character.maxHp, character.hp + delta)),
    });
  };

  const totalWeight = inventory.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">D&D Companion</h1>
            <p className="text-muted-foreground">Твой цифровой помощник для игры</p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="master-mode" className="text-sm">
              {isMaster ? '⚔️ Мастер' : '🎭 Игрок'}
            </Label>
            <Switch
              id="master-mode"
              checked={isMaster}
              onCheckedChange={setIsMaster}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="character">
              <Icon name="User" className="mr-2 h-4 w-4" />
              Персонаж
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Icon name="Activity" className="mr-2 h-4 w-4" />
              Характеристики
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Icon name="Backpack" className="mr-2 h-4 w-4" />
              Инвентарь
            </TabsTrigger>
            <TabsTrigger value="notes">
              <Icon name="BookOpen" className="mr-2 h-4 w-4" />
              Заметки
            </TabsTrigger>
            <TabsTrigger value="dice">
              <Icon name="Dices" className="mr-2 h-4 w-4" />
              Дайсы
            </TabsTrigger>
            <TabsTrigger value="campaign">
              <Icon name="Map" className="mr-2 h-4 w-4" />
              Кампания
            </TabsTrigger>
          </TabsList>

          <TabsContent value="character" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Имя персонажа</Label>
                    <Input
                      value={character.name}
                      onChange={(e) =>
                        setCharacter({ ...character, name: e.target.value })
                      }
                      disabled={!isMaster}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Класс</Label>
                      <Input
                        value={character.class}
                        onChange={(e) =>
                          setCharacter({ ...character, class: e.target.value })
                        }
                        disabled={!isMaster}
                      />
                    </div>
                    <div>
                      <Label>Уровень</Label>
                      <Input
                        type="number"
                        value={character.level}
                        onChange={(e) =>
                          setCharacter({
                            ...character,
                            level: parseInt(e.target.value) || 1,
                          })
                        }
                        disabled={!isMaster}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Состояние</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Здоровье (HP)</Label>
                      <Badge variant="outline">
                        {character.hp} / {character.maxHp}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateHP(-1)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Icon name="Minus" className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => updateHP(1)}
                        variant="default"
                        size="sm"
                        className="flex-1"
                      >
                        <Icon name="Plus" className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(character.hp / character.maxHp) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Класс защиты (AC)</Label>
                    <Input
                      type="number"
                      value={character.ac}
                      onChange={(e) =>
                        setCharacter({
                          ...character,
                          ac: parseInt(e.target.value) || 10,
                        })
                      }
                      disabled={!isMaster}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Характеристики персонажа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(character.stats).map(([stat, value]) => {
                    const modifier = Math.floor((value - 10) / 2);
                    const statNames: Record<string, string> = {
                      str: 'Сила',
                      dex: 'Ловкость',
                      con: 'Телосложение',
                      int: 'Интеллект',
                      wis: 'Мудрость',
                      cha: 'Харизма',
                    };
                    return (
                      <Card key={stat} className="bg-muted">
                        <CardContent className="p-4 text-center">
                          <div className="text-sm text-muted-foreground mb-2">
                            {statNames[stat]}
                          </div>
                          <div className="text-3xl font-bold mb-1">{value}</div>
                          <Badge variant={modifier >= 0 ? 'default' : 'destructive'}>
                            {modifier >= 0 ? '+' : ''}
                            {modifier}
                          </Badge>
                          {isMaster && (
                            <div className="flex gap-1 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setCharacter({
                                    ...character,
                                    stats: { ...character.stats, [stat]: value - 1 },
                                  })
                                }
                              >
                                -
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setCharacter({
                                    ...character,
                                    stats: { ...character.stats, [stat]: value + 1 },
                                  })
                                }
                              >
                                +
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Инвентарь</span>
                  <Badge variant="secondary">Вес: {totalWeight.toFixed(1)} кг</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Название предмета"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <Input
                    placeholder="Вес"
                    type="number"
                    step="0.1"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={addInventoryItem}>
                    <Icon name="Plus" className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {inventory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.weight} кг × {item.quantity}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInventoryItem(item.id)}
                          disabled={!isMaster}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Заметки и квесты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Заголовок заметки"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Содержание заметки..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={addNote} className="w-full">
                    <Icon name="Plus" className="mr-2 h-4 w-4" />
                    Добавить заметку
                  </Button>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <Card key={note.id} className="bg-muted">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNote(note.id)}
                            >
                              <Icon name="X" className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dice">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Бросок дайсов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[4, 6, 8, 10, 12, 20].map((sides) => (
                      <Button
                        key={sides}
                        onClick={() => rollDice(sides)}
                        size="lg"
                        className="h-20 text-lg font-bold"
                        variant={sides === 20 ? 'default' : 'outline'}
                      >
                        <div className="flex flex-col items-center">
                          <Icon name="Dices" className="h-6 w-6 mb-1" />
                          d{sides}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>История бросков</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {diceHistory.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Ещё не было бросков
                        </p>
                      ) : (
                        diceHistory.map((roll) => (
                          <div
                            key={roll.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">{roll.dice}</Badge>
                              <Icon name="ArrowRight" className="h-4 w-4" />
                              <span className="text-2xl font-bold text-primary">
                                {roll.result}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(roll.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaign">
            <Card>
              <CardHeader>
                <CardTitle>Информация о кампании</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12">
                  <Icon name="Map" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Раздел в разработке</h3>
                  <p className="text-muted-foreground">
                    Здесь будет информация о текущей кампании, локациях и NPC
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
