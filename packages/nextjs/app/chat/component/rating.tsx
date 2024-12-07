import React from 'react';

interface Rating {
    rating: number | null;
}
const EmojiRating = ({ rating }: Rating) => {
    if (!rating) {
        return null;
    }
    let ratedEmojis = '';
    switch (parseInt(rating.toString())) {
        case 1:
            ratedEmojis = '👎';
            break;
        case 2:
            ratedEmojis = '👎👍';
            break;
        case 3:
            ratedEmojis = '👍✌🏻';
            break;
        case 4:
            ratedEmojis = '🖖';
            break;
        case 5:
            ratedEmojis = '🤚';
            break;
        case 6:
            ratedEmojis = '🤚👍';
            break;
        case 7:
            ratedEmojis = '🤚✌🏻';
            break;
        case 8:
            ratedEmojis = '🤚✌🏼👍';
        case 9:
            ratedEmojis = '🤚✌🏻✌🏻';
        case 10:
            ratedEmojis = '🙌🏼';
        default:
            ratedEmojis = '';
    } 
    return (
        <div>
            <span className='gradient-text'>NookFlixAI Rating <span className='gradient-text-2'>{ratedEmojis}</span></span>
        </div>
    );
};

export default EmojiRating;
