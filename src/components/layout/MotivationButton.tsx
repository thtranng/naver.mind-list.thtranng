import React, { useState } from 'react';
import { Trophy, Flame, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MotivationHub } from '../gamification/MotivationHub';

export function MotivationButton() {
  const { state } = useApp();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-auto p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all duration-200"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-purple-800">GAMIFICATION</div>
              <div className="text-sm text-purple-600">MIND LIST</div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Lv.{state.levelData?.level || 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-medium text-orange-600">{state.streak}</span>
              </div>
            </div>

          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('nav.gamification')}
              </span>
              <div className="text-sm text-gray-600 font-normal">
                {t('app.name')}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <MotivationHub />
      </DialogContent>
    </Dialog>
  );
}