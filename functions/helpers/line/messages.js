const numberToStringCurrency = (amount) => {
  return Intl.NumberFormat().format(amount)
}

const salaryMessage = ([, name, department, salary = 0, ot = 0]) => {
  const salaryFloat = parseFloat(salary)
  const otFloat = parseFloat(ot)
  const total = salaryFloat + otFloat

  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'KAJAME COMPANY',
          color: '#1DB446',
          size: 'md',
          weight: 'bold'
        },
        {
          type: 'text',
          text: `${department}`,
          weight: 'bold',
          size: 'xxl',
          margin: 'md'
        },
        {
          type: 'text',
          text: `คุณ${name}`,
          size: 'sm',
          color: '#555555',
          wrap: true,
          margin: 'sm'
        },
        {
          type: 'separator',
          margin: 'xxl'
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'xxl',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'เงินเดือน',
                  size: 'md',
                  color: '#777777',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `${numberToStringCurrency(salary)} บาท`,
                  size: 'md',
                  color: '#777777',
                  align: 'end'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'โอที',
                  size: 'md',
                  color: '#777777',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `${numberToStringCurrency(ot)} บาท`,
                  size: 'md',
                  color: '#777777',
                  align: 'end'
                }
              ]
            }
          ]
        },
        {
          type: 'separator',
          margin: 'xxl'
        },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'lg',
          contents: [
            {
              type: 'text',
              text: 'รวมเป็นเงิน',
              size: 'lg',
              color: '#555555',
              flex: 0,
              weight: 'bold'
            },
            {
              type: 'text',
              text: `${numberToStringCurrency(total)} บาท`,
              color: '#555555',
              size: 'lg',
              align: 'end',
              weight: 'bold',
              style: 'normal'
            }
          ]
        }
      ]
    },
    styles: {
      footer: {
        separator: true
      }
    }
  }
}

module.exports = { salaryMessage }
