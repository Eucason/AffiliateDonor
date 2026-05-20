import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { donationAPI, CreateDonationRequest } from '@/services/donationAPI'

export const useDonations = (userId?: string) => {
  return useQuery({
    queryKey: ['donations', userId],
    queryFn: () => donationAPI.getUserDonations(userId),
    enabled: !!userId,
  })
}

export const useCreateDonation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDonationRequest) => donationAPI.createDonation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}
