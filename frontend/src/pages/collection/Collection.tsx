import { CardsTable } from '@/components/CardsTable.tsx'
import FilterPanel from '@/components/FiltersPanel'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { CollectionContext } from '@/lib/context/CollectionContext.ts'
import { fetchCollection } from '@/lib/fetchCollection.ts'
import CardDetail from '@/pages/collection/CardDetail.tsx'
import type { Card, CollectionRow } from '@/types'
import { Siren } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useParams } from 'react-router'

function Collection() {
  const params = useParams()
  const { t } = useTranslation(['pages/collection'])
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const { ownedCards, selectedCardId, setSelectedCardId } = useContext(CollectionContext)
  const [resetScrollTrigger, setResetScrollTrigger] = useState(false)
  const [friendCards, setFriendCards] = useState<CollectionRow[] | null>(null)
  const [filteredCards, setFilteredCards] = useState<Card[] | null>(null)

  useEffect(() => {
    const friendId = params.friendId
    if (friendId && !friendCards) {
      console.log('fetching collection by friend id', friendId)
      fetchCollection(undefined, friendId).then(setFriendCards).catch(console.error)
    } else if (!friendId && friendCards) {
      // NOTE: because the card table is hard to refresh, we have to reload the page. This is a bit of a hack, but it works. If you figure  a better way, please let me know.
      window.location.reload()
    }
  }, [params])

  useEffect(() => {
    return () => {
      setFriendCards(null)
    }
  }, [])

  const cardCollection = useMemo(() => {
    // if friendId is in the url, return friendCards, otherwise return ownedCards. FriendCards can be null if they are still loading.
    if (params.friendId) {
      return friendCards
    }
    return ownedCards || []
  }, [ownedCards, friendCards])

  useEffect(() => {
    setResetScrollTrigger(true)

    const timeout = setTimeout(() => setResetScrollTrigger(false), 100)

    return () => clearTimeout(timeout)
  }, [filteredCards])

  return (
    <div className="flex flex-col gap-y-1 mx-auto max-w-[900px]">
      <FilterPanel
        cards={cardCollection}
        onFiltersChanged={(cards) => setFilteredCards(cards)}
        visibleFilters={{ expansions: !isMobile, search: true, owned: !isMobile, rarity: !isMobile }}
        filtersDialog={{ expansions: true, search: true, owned: true, rarity: true }}
        batchUpdate={Boolean(!friendCards)}
      >
        <div>
          {friendCards && (
            <Alert className="mb-2 border-2 border-slate-600 shadow-none">
              <Siren className="h-4 w-4" />
              <AlertTitle>{t('publicCollectionTitle')}</AlertTitle>
              <AlertDescription>{t('publicCollectionDescription')}</AlertDescription>
            </Alert>
          )}
        </div>
      </FilterPanel>
      <div>{filteredCards && <CardsTable cards={filteredCards} resetScrollTrigger={resetScrollTrigger} showStats />}</div>
      <CardDetail cardId={selectedCardId} onClose={() => setSelectedCardId('')} />
    </div>
  )
}

export default Collection
