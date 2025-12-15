from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ScoreBoard


@api_view(['GET'])
def get_leaderboard(request):
    top_five_records = ScoreBoard.objects.order_by('-score')[:5]
    top_five_list = list(top_five_records.values('name', 'score'))

    return Response(top_five_list)

@api_view(['POST'])
def save_score(request):
    name = request.data.get('name')
    score = request.data.get('score')

    if not name or not score:
        return Response({'error': 'Please provide score and name!'}, status=400)

    score = int(score)
    if score < 0:
        return Response({'error': 'Please provide valid score!'}, status=400)

    ScoreBoard.objects.create(name=name, score=score)
    return Response(
        {
            'name': name,
            'score': score,
        },
        status=200
    )
