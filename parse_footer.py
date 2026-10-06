html = open('real_site.html', encoding='utf-8').read()
pos = html.find('footertc')
if pos != -1:
    with open('footertc_bottom.txt', 'w', encoding='utf-8') as f:
        f.write(html[pos+1000:pos+3500])
    print("Wrote footertc_bottom.txt")
