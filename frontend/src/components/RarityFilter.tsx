import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Rarity } from '@/types'
import { type FC, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  rarityFilter: Rarity[]
  setRarityFilter: (rarityFilter: Rarity[]) => void
  deckbuildingMode?: boolean
  collapse?: boolean
}
const RarityFilter: FC<Props> = ({ rarityFilter, setRarityFilter, deckbuildingMode, collapse }) => {
  const { t } = useTranslation('rarity-filter')

  useEffect(() => {
    if (deckbuildingMode) {
      const basicRarities: Rarity[] = ['◊', '◊◊', '◊◊◊', '◊◊◊◊']
      setRarityFilter(rarityFilter.filter((rf) => basicRarities.includes(rf)))
    }
  }, [deckbuildingMode])

  const Toggles = useMemo(
    () => (
      <ToggleGroup
        variant="outline"
        type="multiple"
        size="sm"
        value={rarityFilter}
        onValueChange={(value: Rarity[]) => setRarityFilter(value)}
        className={`justify-center shadow-none border-2 border-slate-600 rounded-md flex-wrap ${collapse ? 'flex-col' : 'flex-row'}`}
      >
        <ToggleGroupItem value="◊" aria-label="◊" className="text-gray-400 hover:text-gray-500">
          ♢
        </ToggleGroupItem>
        <ToggleGroupItem value="◊◊" aria-label="◊◊" className="text-gray-400 hover:text-gray-500">
          ♢♢
        </ToggleGroupItem>
        <ToggleGroupItem value="◊◊◊" aria-label="◊◊◊" className="text-gray-400 hover:text-gray-500">
          ♢♢♢
        </ToggleGroupItem>
        <ToggleGroupItem value="◊◊◊◊" aria-label="◊◊◊◊" className="text-gray-400 hover:text-gray-500">
          ♢♢♢♢
        </ToggleGroupItem>
        {!deckbuildingMode && (
          <>
            <ToggleGroupItem value="☆" aria-label="☆" className="text-yellow-500 hover:text-yellow-600 .dark:data-[state=on]:text-yellow-500">
              ☆
            </ToggleGroupItem>
            <ToggleGroupItem value="☆☆" aria-label="☆☆" className="text-yellow-500 hover:text-yellow-600 data-[state=on]:text-yellow-500">
              ☆☆
            </ToggleGroupItem>
            <ToggleGroupItem value="☆☆☆" aria-label="☆☆☆" className="text-yellow-500 hover:text-yellow-600 data-[state=on]:text-yellow-500">
              ☆☆☆
            </ToggleGroupItem>
            <ToggleGroupItem value="✵" aria-label="✵" className="text-pink-300 hover:text-pink-500 .dark:data-[state=on]:text-pink-400">
              ✵
            </ToggleGroupItem>
            <ToggleGroupItem value="✵✵" aria-label="✵✵" className="text-pink-300 hover:text-pink-500 data-[state=on]:text-pink-400">
              ✵✵
            </ToggleGroupItem>
            <ToggleGroupItem value="Crown Rare" aria-label="♛">
              👑
            </ToggleGroupItem>
          </>
        )}
      </ToggleGroup>
    ),
    [rarityFilter, collapse, deckbuildingMode],
  )

  if (!collapse) {
    return Toggles
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {t('filters')} ({rarityFilter.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32">{Toggles}</PopoverContent>
    </Popover>
  )
}

export default RarityFilter
