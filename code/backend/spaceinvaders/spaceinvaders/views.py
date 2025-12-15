from rest_framework.decorators import api_view
from rest_framework.response import Response
from models import ScoreBoard

@api_view(['GET'])
def get_leaderboard(request):
    top_five_records = ScoreBoard.objects.order_by('-score')[:5]
    return Response(list(top_five_records))
