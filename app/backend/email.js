import {sendgrid_key} from './secrets.js';
import http from 'superagent';

export function emailMiddleWare(req, res, next) {
  console.log(req.body)
  http.post('https://api.sendgrid.com/api/mail.send.json')
    .set('Authorization', `Bearer ${sendgrid_key}`)
    .type('form')
    .send({
      to: 'desmondclee@gmail.com',
      subject: 'Received a message from your website!',
      text: `The sent message is:\n\n${req.body.message}`,
      from: req.body.email
    }).end((err, result) => {
      if (!err) {
        res.send('Success');
      } else {
        res.send("Error")
      }
      console.log(res.text)
    });
}