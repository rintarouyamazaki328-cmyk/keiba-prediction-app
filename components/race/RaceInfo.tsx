'use client';

import React from 'react';
import { CalendarDays, MapPin, Flag, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRaceStore } from '@/store/useRaceStore';
import { VENUES, RACE_NUMBERS, QUICK_LINKS } from '@/lib/constants';

export function RaceInfo() {
  const { race, setRace } = useRaceStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          レース情報
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              日付
            </Label>
            <Input
              id="date"
              type="date"
              value={race.date}
              onChange={(e) => setRace({ date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              競馬場
            </Label>
            <Select
              value={race.venue}
              onValueChange={(value) => setRace({ venue: value })}
            >
              <SelectTrigger id="venue">
                <SelectValue placeholder="競馬場を選択" />
              </SelectTrigger>
              <SelectContent>
                {VENUES.map((venue) => (
                  <SelectItem key={venue} value={venue}>
                    {venue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="raceNumber">レース番号</Label>
            <Select
              value={String(race.raceNumber)}
              onValueChange={(value) =>
                setRace({ raceNumber: parseInt(value, 10) })
              }
            >
              <SelectTrigger id="raceNumber">
                <SelectValue placeholder="レース番号" />
              </SelectTrigger>
              <SelectContent>
                {RACE_NUMBERS.map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}R
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="raceName">レース名</Label>
            <Input
              id="raceName"
              value={race.raceName}
              onChange={(e) => setRace({ raceName: e.target.value })}
              placeholder="レース名（任意）"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Label className="text-sm text-muted-foreground mb-2 block">
            クイックリンク
          </Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={QUICK_LINKS.rakuten(race.venue, race.date)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                楽天競馬
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={QUICK_LINKS.netkeiba(race.venue, race.date)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                netkeiba
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={QUICK_LINKS.jra(race.venue, race.date)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                JRA公式
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
