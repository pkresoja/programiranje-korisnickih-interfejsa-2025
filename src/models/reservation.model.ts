export interface ReservationModel {
    flightId: number,
    airline: string,
    suite: string,
    createdAt: string,
    updatedAt: string | null,
    status: 'paid' | 'waiting' | 'canceled' | 'liked' | 'disliked'
}