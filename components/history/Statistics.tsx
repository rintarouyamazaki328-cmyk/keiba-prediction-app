'use client';

import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePredictionStore } from '@/store/usePredictionStore';
import { cn } from '@/lib/utils';

export function Statistics() {
  const { getStatistics } = usePredictionStore();
  const stats = getStatistics();

  const statCards = [
    {
      label: '予想回数',
      value: stats.total,
      unit: '回',
      icon: Target,
      color: 'text-blue-500',
    },
    {
      label: '的中数',
      value: stats.hits,
      unit: '回',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: '不的中数',
      value: stats.misses,
      unit: '回',
      icon: TrendingDown,
      color: 'text-red-500',
    },
    {
      label: '的中率',
      value: stats.hitRate.toFixed(1),
      unit: '%',
      icon: Percent,
      color: 'text-yellow-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          統計情報
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-muted rounded-lg text-center"
            >
              <stat.icon className={cn('h-6 w-6 mx-auto mb-2', stat.color)} />
              <div className="text-2xl font-bold">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground">
                  {stat.unit}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 収支情報 */}
        <div className="p-4 bg-primary/5 rounded-lg space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            収支情報
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">投資額</div>
              <div className="text-xl font-bold text-red-500">
                ¥{stats.totalInvestment.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">払戻額</div>
              <div className="text-xl font-bold text-green-500">
                ¥{stats.totalPayout.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">回収率</span>
              <span
                className={cn(
                  'text-2xl font-bold',
                  stats.returnRate >= 100 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {stats.returnRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-muted-foreground">収支</span>
              <span
                className={cn(
                  'text-xl font-bold',
                  stats.totalPayout - stats.totalInvestment >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {stats.totalPayout - stats.totalInvestment >= 0 ? '+' : ''}¥
                {(stats.totalPayout - stats.totalInvestment).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ヒント */}
        {stats.total === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            予想を保存して結果を入力すると、統計が表示されます
          </p>
        )}
      </CardContent>
    </Card>
  );
}
