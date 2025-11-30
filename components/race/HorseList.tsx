'use client';

import React, { useState, useMemo } from 'react';
import {
  List,
  Plus,
  ArrowUpDown,
  Filter,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HorseCard } from './HorseCard';
import { QuickInput } from './QuickInput';
import { useHorseStore } from '@/store/useHorseStore';
import { usePredictionStore } from '@/store/usePredictionStore';
import { RUNNING_STYLES } from '@/lib/constants';
import type { Horse, RunningStyle } from '@/types';

export function HorseList() {
  const {
    horses,
    addHorse,
    updateHorse,
    deleteHorse,
    clearHorses,
    sortByOdds,
    sortByNumber,
  } = useHorseStore();
  const { currentPrediction } = usePredictionStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHorse, setEditingHorse] = useState<Horse | null>(null);
  const [styleFilter, setStyleFilter] = useState<RunningStyle | 'all'>('all');

  const [formData, setFormData] = useState({
    waku: 1,
    number: 1,
    name: '',
    jockey: '',
    style: 'sashi' as RunningStyle,
    odds: 0,
  });

  const filteredHorses = useMemo(() => {
    if (styleFilter === 'all') return horses;
    return horses.filter((h) => h.style === styleFilter);
  }, [horses, styleFilter]);

  const resetForm = () => {
    setFormData({
      waku: 1,
      number: horses.length + 1,
      name: '',
      jockey: '',
      style: 'sashi',
      odds: 0,
    });
  };

  const handleAdd = () => {
    addHorse(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (editingHorse) {
      updateHorse(editingHorse.id, formData);
      setEditingHorse(null);
      resetForm();
    }
  };

  const openEditDialog = (horse: Horse) => {
    setFormData({
      waku: horse.waku,
      number: horse.number,
      name: horse.name,
      jockey: horse.jockey,
      style: horse.style,
      odds: horse.odds,
    });
    setEditingHorse(horse);
  };

  const getSelectionRank = (horseId: string) => {
    if (currentPrediction.first === horseId) return 'first';
    if (currentPrediction.second === horseId) return 'second';
    if (currentPrediction.third === horseId) return 'third';
    if (currentPrediction.fukusho === horseId) return 'fukusho';
    return undefined;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <List className="h-5 w-5" />
              出走馬一覧
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredHorses.length}頭)
              </span>
            </span>
            <div className="flex items-center gap-2">
              <QuickInput />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* フィルター・ソートバー */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={styleFilter}
                onValueChange={(v) => setStyleFilter(v as RunningStyle | 'all')}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {Object.entries(RUNNING_STYLES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Button variant="outline" size="sm" onClick={sortByNumber}>
                馬番順
              </Button>
              <Button variant="outline" size="sm" onClick={sortByOdds}>
                オッズ順
              </Button>
            </div>
            {horses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearHorses}
                className="ml-auto text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                全削除
              </Button>
            )}
          </div>

          {/* 馬リスト */}
          {filteredHorses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              出走馬を追加してください
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHorses.map((horse) => (
                <HorseCard
                  key={horse.id}
                  horse={horse}
                  onEdit={() => openEditDialog(horse)}
                  onDelete={() => deleteHorse(horse.id)}
                  isSelected={!!getSelectionRank(horse.id)}
                  selectionRank={getSelectionRank(horse.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 追加/編集ダイアログ */}
      <Dialog
        open={isAddDialogOpen || !!editingHorse}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingHorse(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHorse ? '馬の編集' : '馬の追加'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>枠番</Label>
                <Select
                  value={String(formData.waku)}
                  onValueChange={(v) =>
                    setFormData({ ...formData, waku: parseInt(v, 10) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}枠
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>馬番</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number: parseInt(e.target.value, 10) || 1,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>馬名</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="馬名を入力"
              />
            </div>
            <div className="space-y-2">
              <Label>騎手名</Label>
              <Input
                value={formData.jockey}
                onChange={(e) =>
                  setFormData({ ...formData, jockey: e.target.value })
                }
                placeholder="騎手名を入力"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>脚質</Label>
                <Select
                  value={formData.style}
                  onValueChange={(v) =>
                    setFormData({ ...formData, style: v as RunningStyle })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RUNNING_STYLES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>オッズ</Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  value={formData.odds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      odds: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setEditingHorse(null);
              resetForm();
            }}>
              キャンセル
            </Button>
            <Button onClick={editingHorse ? handleEdit : handleAdd}>
              {editingHorse ? '更新' : '追加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
