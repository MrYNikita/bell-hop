<div align=center style="display: flex; flex-flow: column; justify-content: center; align-items: center; gap: 40px; background-image: linear-gradient(45deg, #4000ff, #c782ff); border-radius: 3px;">
  <p style="height: 10px; font-size: 3rem; padding-top: 10px;">
    <strong>bell-hop</strong>
  </p>
  <p style="height: min-content;">
    <strong style="background-color: #e565ff40; padding: 3px; border-radius: 3px; letter-spacing: 2px;">v2.0.0</strong>
  </p>
</div></br>

<p align=center><i>Рекомендуется просматривать через VSCode</i></p>

<h2 align=center id=content>Содержание</h2>

- [**bell-hop**](#header)
  - [**Что нового?**](#feature)
  - [**Содержание**](#content)
  - [**Описание**](#description)
  - [**Быстрый старт**](#quickstart)
  - [**Рекомендации**](#recom)
  - [**Документация**](#docs)
    - [Теги](#tags)
      - [_`<bell-hop>`_](#bell-hop)
      - [_`<bell-point>`_](#bell-point)
      - [_`<bell-button>`_](#bell-button)
      - [_`<bell-even>`_](#bell-even)
      - [_`<bell-pod>`_](#bell-pod)
      - [_`<bell-wrapper>`_](#bell-wrapper)
    - [Параметры](#attrs)
      - [_`root`_](#attr-root) 
      - [_`name`_](#attr-name)
      - [_`active`_](#attr-active)
      - [_`step`_](#attr-step)
      - [_`bind`_](#attr-bind)
      - [_`goto`_](#attr-goto)
      - [_`time`_](#attr-time)
      - [_`to`_](#attr-to)
      - [_`ain`_](#attr-ain)
      - [_`aex`_](#attr-aex)
      - [_`points`_](#attr-points)
      - [_`act`_](#attr-act)
      - [_`cond`_](#attr-cond)
    - [Гайд](#guide)
      - [`Перемещение по коридору`](#guide-transit)
        - [_`goto`_](#guide-transit-goto)
        - [_`step`_](#guide-transit-step)
        - [_`time-to`_](#guide-transit-time-to)
      - [`Перемещение между вложенным и родительским коридором`](#guide-moving-between-bell-hop)
      - [`Анимированные переходы`](#guide-anima-transit)
        - [_`ain`_](#guide-anima-transit-ain)
        - [_`aex`_](#guide-anima-transit-aex)
      - [`Изоляция пространств`](#guide-insulation)
      - [`URL параметры`](#guide-url)
        - [_`bell-hop-<point-name>-goto`_](#guide-goto)
        - [_`bell-hop-<point-name>-step`_](#guide-step)
        - [_`bell-hop-<point-name>-skip`_](#guide-skip)

<h2 align=center id=feature>Что нового?</h2>

Версия `2.0.0` появилась почти что сразу же после выпуска в релиз версии `1.0.0`. Основой для идеи данного выпуска послужил [`react-router-dom`](https://github.com/remix-run/react-router). Что же было взято и что изменилось в проекте?

### Разделение планировки и разметки
Ранее в версии `1.0.0` разметка выглядела следующим образом:

```html
<body>
  <bell-hop class="main">
    <bell-point class="home" root active>
      <div>Home</div>
    </bell-point>
    <bell-point class="school">
      <div>School</div>
    </bell-point>
  </bell-hop>
</body>
```
<p align=center><i>Пример разметки v1.0.0</i></p>

Данный пример является максимально простым по меркам `bell-hop`. Даже такой вариант является очень сложным для понимания. При масштабировании сложность существенно увеличивается. Во многом это связано с тем, что проектирование [коридора](#bell-hop) и разметка осуществляются не раздельно.

Новая версия `2.0.0` разделяет проектирование и разметку. Теперь итоговый вариант выглядит следующим образом:

```html
<body>
  <bell-hop name="main" loc="body">
    <bell-point name="home"></bell-point>
    <bell-point name="school"></bell-point>
  </bell-hop>

  <bell-route bind="main" point="home">
    <div>Home</div>
  </bell-route>

  <bell-route bind="main" point="school">
    <div>School</div>
  </bell-route>
</body>
```
<p align=center><i>Пример разметки v2.0.0</i></p>

Данное решение существенно отличается от первого варианта. В нём логика разделена друг от друга. Это существенно упрощает разработку сложных интерфейсов.

### Эндпоинтный подход разработки


<h2 align=center id=description>Описание</h2>

<h2 align=center id=quickstart>Быстрый старт</h2>

<h2 align=center id=recom>Рекомендации</h2>

Существует перечень рекомендаций для использования библиотеки `bell-hop`. Соблюдение рекомендаций позволит сделать работу библиотеки более предсказуемой, безопасной и эффективной.

### Подключение скрипта
Библиотека `bell-hop` может быть подключена как к _`<head>`_, так и к _`<body>`_ элементам страницы, однако правильным является именно подключение к _`<head>`_ элементу. Это позволит скрипту выполниться ранее размещения элементов страницы, что позволит их корректно отображать.

### Всегда именуйте элементы
При наличии наименования, [_`<bell-hop>`_](#bell-hop) справлялется намного лучше. Элементы же, такие как [_`<bell-point>`_](#bell-point), требуют наименования обязательно, т.к. без этого работать навигация не будет.

### Правила наименования сущностей
1. Присваивать имя рекомендуется через `class` свойство.
2. Для нейминга лучше всего использовать максимально понятный и осмысленный текст в `lower-case` стиле.
3. Для избежания каких-либо ошибок в рамках одного коридора необходимо именовать все сущности уникальными именами.

### Наименование через классы
`bell-hop` позволяет присуждать имена своим сущностям, таким как [_`<bell-hop>`_](#bell-hop) и [_`<bell-point>`_](#bell-point) с помощью первого присвоенного класса. Важно учитывать это и стараться назначать для таких сущностей уникальные классы, не приводящие к конфликтам со стилями остальной разметки.

> Помните, что класс из `css` и имя сущности могут совпасть и это может привести к некорректному отображению всего коридора.

### _`step`_ лучше _`goto`_
`step` перемещается по определенным правилам:
- Может осуществить переход только в родителя, в соседей по [_`<bell-point>`_](#bell-point) или во вложенные [_`<bell-point>`_](#bell-point). Это позволяет поддерживать изоляцию путей в коридоре.
- При переходах выполняет все встречанные [_`bell-even`_](#bell-even). _`goto`_ тоже выполняет [_`bell-even`_](#bell-even), но пропускает все те, что лежали на пути от текущей точки до конечной.
- _`step`_ структуризирует коридор, делая его маршруты более наглядными и упорядоченными. _`goto`_ же свободно перемещается между любыми элементами, усложняя понимание маршрутов в коридоре и делая их более анархичными.

> Данная рекомендация не означает, что Вам необходимо использовать исключительно _`step`_.

<h2 align=center id=docs>Документация</h2>

<h3 align=center id=tags>Теги</h3>

<h4>bell-hop</h4>

<h5><i>Описание</i></h5>

Тег _`<bell-hop>`_ является тегом инициализатором коридоров. В документации именуется как "коридор". Внутри себя _`bell-hop`_ содержит [_`<bell-point>`_](#bell-point) элементы, которые работают только в нём. Среди таких элементов определяется один [_`root`_](#attr-root) элемент, который выступает точкой входа в коридор. Помимо [_`root`_](#attr-root) также определены такие элементы как [_`active`_](#attr-active) и [_`prev`_](#attr-prev), которых также может быть не более одного.

> Следует отметить, что [_`root`_](#attr-root) элемент также может быть как [_`active`_](#attr-active), так и [_`prev`_](#attr-prev).

Работает _`bell-hop`_ за счёт **`CSS`** стилей. Коридор отображает вложенные в него [_`<bell-point>`_](#bell-point) элементы только в том случае, если:

- Они являются [_`active`_](#attr-active);
- Они содержат [_`active`_](#attr-active) эндпоинт.

Для [_`active`_](#attr-active) эндпоинтов коридор отображает не только сами эндпоинты, но и их содержимое, обернутое в [_`bell-wrapper`_](#bell-wrapper). Если же эндпоинт не [_`active`_](#attr-active), но содерджит внутри себя таковой, то он будет отображён без контента. Прочие эндпоинты не отображаются вовсе.

Как элемент _`<bell-hop>`_ также предоставляет функционал, который позволяет находить нужные [_`<bell-point>`_](#bell-point) вложенные в него.

<h5><i>Свойства</i></h5>

- [_`name`_](#attr-name) - Определяет наименование _`<bell-hop>`_.
- [_`ain`_](#attr-ain) - Определяет анимацию появления [_`<bell-point>`_](#bell-point) элемента по умолчанию.
- [_`aex`_](#attr-aex) - Определяет анимацию исчезновения [_`<bell-point>`_](#bell-point) элемента по умолчанию.

<h5><i>Методы</i></h5>

<p align=center id=getPoint><i>getPoint</i></p>

```tsx
bellhop.getPoint(name: string): <bell-point>...</bell-point>;
```
Позволяет получить [_`<bell-point>`_](#bell-point) элемент из _`bell-hop`_ по имени эндпоинта.

> Именем для эндпоинта может выступать как [_`name`_](#attr-name), так и первый класс эндпоинта.

***

<p align=center id=getPoints><i>getPoints</i></p>

```tsx
bellhop.getPoints(): <bell-point>...</bell-point>[];
```
Работает в точности как [_getPoint_](#getPoint), однако возвращает все [_`<bell-point>`_](#bell-point) элементы вложенные в коридор.

***

<p align=center id=getRootPoint><i>getRootPoint</i></p>

```tsx
bellhop.getRootPoints(): <bell-point>...</bell-point>;
```
Метод получения [_`<bell-point>`_](#bell-point)[_`root`_](#attr-root) элемента.

***
<p align=center id=getActivePoint>getActivePoint</p>

```tsx
bellhop.getActivePoint(): <bell-point>...</bell-point>; 
```
Метод получения [_`<bell-point>`_](#bell-point)[_`active`_](#attr-active) элемента.